import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { verify } from 'hono/utils/jwt/jwt';

export class SalesController {
    private prisma: PrismaClient;

    constructor(databaseUrl: string, private jwtSecret: SignatureKey) {
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl
                }
            }
        });
        this.prisma.$extends(withAccelerate());
    }

    public createSale = async (c: any) => {
        const warehouseId = c.req.header('warehouseId');
        if (!warehouseId) {
            return c.json({ error: 'Warehouse ID is required' }, 400);
        }

        try {
            const body = await c.req.json();
            console.log('Received sale request:', body);
            
            const { productId, quantity, totalAmount } = body;

            if (!productId || !quantity || !totalAmount) {
                return c.json({ 
                    error: 'Product ID, quantity, and total amount are required',
                    received: { productId, quantity, totalAmount }
                }, 400);
            }

            // Find the product
            const product = await this.prisma.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                return c.json({ 
                    error: 'Product not found',
                    productId 
                }, 404);
            }

            // Check if quantity is available
            if (product.quantity < quantity) {
                return c.json({ 
                    error: 'Not enough quantity available',
                    available: product.quantity,
                    requested: quantity 
                }, 400);
            }

            try {
                const [sale] = await this.prisma.$transaction([
                    // Create sale record
                    this.prisma.sale.create({
                        data: {
                            productId,
                            warehouseId,
                            quantity,
                            totalAmount,
                            saleDate: new Date(),
                            invoiceNumber: `INV-${Date.now()}`,
                            productName: product.name,
                            productPrice: product.price,
                        }
                    }),
                    // Update product quantity
                    this.prisma.product.update({
                        where: { id: productId },
                        data: {
                            quantity: {
                                decrement: quantity
                            }
                        }
                    }),
                    // Update warehouse total stock
                    this.prisma.warehouse.update({
                        where: { id: warehouseId },
                        data: {
                            totalstock: {
                                decrement: quantity
                            }
                        }
                    })
                ]);

                console.log('Sale recorded:', sale);

                return c.json({ 
                    message: 'Sale recorded successfully',
                    sale 
                });
            } catch (transactionError) {
                console.error('Transaction error:', transactionError);
                return c.json({ 
                    error: 'Database transaction failed',
                    details: (transactionError as Error).message 
                }, 500);
            }
        } catch (error) {
            console.error('Error recording sale:', error instanceof Error ? error.message : error);
            return c.json({ 
                error: 'Failed to record sale',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 500);
        }
    }

    public getSalesHistory = async (c: any) => {
        const warehouseId = c.req.header('warehouseId');
        if (!warehouseId) {
            return c.json({ error: 'Warehouse ID is required' }, 400);
        }

        try {
            const sales = await this.prisma.sale.findMany({
                where: {
                    warehouseId
                },
                include: {
                    product: true,
                    warehouse: true
                },
                orderBy: {
                    saleDate: 'desc'
                }
            });

            return c.json({
                message: 'Sales history retrieved successfully',
                sales: sales || []
            });
        } catch (error) {
            console.error('Error fetching sales history:', error);
            return c.json({ error: 'Failed to fetch sales history' }, 500);
        }
    }

    public getSaleDetails = async (c: any) => {
        const saleId = c.req.param('id');
        if (!saleId) {
            return c.json({ error: 'Sale ID is required' }, 400);
        }

        try {
            const sale = await this.prisma.sale.findUnique({
                where: {
                    id: saleId
                },
                include: {
                    product: true,
                    warehouse: true
                }
            });

            if (!sale) {
                return c.json({ error: 'Sale not found' }, 404);
            }

            return c.json({
                message: 'Sale details retrieved successfully',
                sale
            });
        } catch (error) {
            console.error('Error fetching sale details:', error);
            return c.json({ error: 'Failed to fetch sale details' }, 500);
        }
    }
} 