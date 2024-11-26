import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Context } from 'hono';

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
            return c.json({ error: 'Source and target warehouse IDs are required' }, 400);
        }

        try {
            const body = await c.req.json();
            const { name, quantity } = body;

            if (!name || !quantity || quantity <= 0) {
                return c.json({ error: 'Valid product name and quantity are required' }, 400);
            }

            // Find source product
            const sourceProduct = await this.prisma.product.findFirst({
                where: {
                    name,
                    warehouseIds: { has: sourceWarehouseId }
                }
            });

            if (!sourceProduct) {
                return c.json({ error: `Product "${name}" not found in source warehouse` }, 404);
            }

            if (sourceProduct.quantity < quantity) {
                return c.json({ 
                    error: `Insufficient quantity. Available: ${sourceProduct.quantity}, Requested: ${quantity}` 
                }, 400);
            }

            // Execute the shift operation in a transaction
            const result = await this.prisma.$transaction(async (tx) => {
                // Update source product
                const remainingQuantity = sourceProduct.quantity - quantity;
                let updatedSourceProduct;

                if (remainingQuantity === 0) {
                    // If no quantity remains, remove the warehouse ID from the product
                    updatedSourceProduct = await tx.product.update({
                        where: { id: sourceProduct.id },
                        data: {
                            quantity: 0,
                            warehouseIds: {
                                set: sourceProduct.warehouseIds.filter(id => id !== sourceWarehouseId)
                            }
                        }
                    });
                } else {
                    // Update quantity only
                    updatedSourceProduct = await tx.product.update({
                        where: { id: sourceProduct.id },
                        data: {
                            quantity: remainingQuantity
                        }
                    });
                }

                // Update source warehouse stock
                await tx.warehouse.update({
                    where: { id: sourceWarehouseId },
                    data: {
                        totalstock: { decrement: quantity }
                    }
                });

                // Find or create target product
                let targetProduct = await tx.product.findFirst({
                    where: {
                        name,
                        warehouseIds: { has: targetWarehouseId }
                    }
                });

                if (targetProduct) {
                    // Update existing product
                    targetProduct = await tx.product.update({
                        where: { id: targetProduct.id },
                        data: {
                            quantity: { increment: quantity }
                        }
                    });
                } else {
                    // Create new product entry
                    targetProduct = await tx.product.create({
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
                        totalstock: { increment: quantity }
                    }
                });

                return { sourceProduct: updatedSourceProduct, targetProduct };
            });

            // Clean up if needed
            if (result.sourceProduct.quantity === 0 && result.sourceProduct.warehouseIds.length === 0) {
                await this.prisma.product.delete({
                    where: { id: result.sourceProduct.id }
                });
            }

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
                        currentQuantity: result.targetProduct.quantity
                    }
                }
            });

        } catch (error) {
            console.error('Error in shiftProduct:', error);
            return c.json({ 
                error: 'Failed to shift product',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 500);
        }
    }
} 