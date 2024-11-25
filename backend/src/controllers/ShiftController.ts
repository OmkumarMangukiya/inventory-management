import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Context } from 'hono';

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    expiry: Date;
    warehouseIds: string[];
}

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export class ShiftController {
    private prisma: PrismaClient;
    
    constructor(databaseUrl: string) {
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl
                }
            }
        }).$extends(withAccelerate()) as unknown as PrismaClient;
    }

    public shiftProduct = async (c: Context) => {
        const sourceWarehouseId = c.req.header('warehouseId');
        const targetWarehouseId = c.req.header('targetWarehouseId');

        if (!sourceWarehouseId || !targetWarehouseId) {
            c.status(400);
            return c.json({ error: 'Source and target warehouse IDs are required' });
        }

        try {
            const body = await c.req.json();
            const { name, quantity } = body;

            if (!name || !quantity || quantity <= 0) {
                c.status(400);
                return c.json({ error: 'Valid product name and quantity are required' });
            }

            // Find source product
            const sourceProduct = await this.prisma.product.findFirst({
                where: {
                    name,
                    warehouseIds: { has: sourceWarehouseId }
                }
            });

            if (!sourceProduct) {
                c.status(404);
                return c.json({ error: `Product "${name}" not found in source warehouse` });
            }

            if (sourceProduct.quantity < quantity) {
                c.status(400);
                return c.json({ 
                    error: `Insufficient quantity. Available: ${sourceProduct.quantity}, Requested: ${quantity}` 
                });
            }

            // Execute transaction
            const result = await this.prisma.$transaction(async (tx: TransactionClient) => {
                // Update source product
                const updatedSourceProduct = await tx.product.update({
                    where: { id: sourceProduct.id },
                    data: {
                        quantity: sourceProduct.quantity - quantity,
                        warehouseIds: sourceProduct.quantity === quantity 
                            ? sourceProduct.warehouseIds.filter(id => id !== sourceWarehouseId)
                            : sourceProduct.warehouseIds
                    }
                });

                // Update source warehouse stock
                await tx.warehouse.update({
                    where: { id: sourceWarehouseId },
                    data: {
                        totalstock: {
                            decrement: quantity
                        }
                    }
                });

                // Find target product
                const targetProduct = await tx.product.findFirst({
                    where: {
                        name,
                        warehouseIds: { has: targetWarehouseId }
                    }
                });

                let updatedTargetProduct;
                if (targetProduct) {
                    // Update existing product
                    updatedTargetProduct = await tx.product.update({
                        where: { id: targetProduct.id },
                        data: {
                            quantity: targetProduct.quantity + quantity
                        }
                    });
                } else {
                    // Create new product
                    updatedTargetProduct = await tx.product.create({
                        data: {
                            name: sourceProduct.name,
                            price: sourceProduct.price,
                            quantity: quantity,
                            expiry: sourceProduct.expiry,
                            warehouseIds: [targetWarehouseId]
                        }
                    });
                }

                // Update target warehouse stock
                await tx.warehouse.update({
                    where: { id: targetWarehouseId },
                    data: {
                        totalstock: {
                            increment: quantity
                        }
                    }
                });

                return {
                    sourceProduct: updatedSourceProduct,
                    targetProduct: updatedTargetProduct
                };
            });

            return c.json({
                message: 'Product shifted successfully',
                details: {
                    productName: name,
                    quantityShifted: quantity,
                    source: {
                        warehouseId: sourceWarehouseId,
                        previousQuantity: sourceProduct.quantity,
                        currentQuantity: result.sourceProduct.quantity
                    },
                    target: {
                        warehouseId: targetWarehouseId,
                        previousQuantity: result.targetProduct.quantity - quantity,
                        currentQuantity: result.targetProduct.quantity
                    }
                }
            });

        } catch (error: unknown) {
            console.error('Error in shiftProduct:', error);
            c.status(500);
            return c.json({ 
                error: 'Failed to shift product',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
} 