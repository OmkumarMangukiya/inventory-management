import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { SignatureKey } from 'hono/utils/jwt/jws';

export class DashboardController {
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

    public getWarehouseStats = async (c: any) => {
        const warehouseId = c.req.query('warehouseId');

        try {
            const warehouse = await this.prisma.warehouse.findUnique({
                where: { id: warehouseId },
                include: {
                    sales: true,
                }
            });

            if (!warehouse) {
                return c.json({ error: 'Warehouse not found' }, 404);
            }

            // Calculate statistics
            const totalRevenue = warehouse.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
            const ordersProcessed = warehouse.sales.length;
            const averageOrderValue = ordersProcessed > 0 ? totalRevenue / ordersProcessed : 0;

            // Get total products
            const totalProducts = await this.prisma.product.count({
                where: {
                    warehouseIds: {
                        has: warehouseId
                    }
                }
            });

            return c.json({
                totalRevenue,
                ordersProcessed,
                averageOrderValue,
                totalProducts
            });
        } catch (error) {
            console.error('Error fetching warehouse stats:', error);
            return c.json({ error: 'Failed to fetch warehouse statistics' }, 500);
        }
    }

    public getDailyProfits = async (c: any) => {
        const warehouseId = c.req.query('warehouseId');
        const days = 7; // Last 7 days

        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const dailySales = await this.prisma.sale.groupBy({
                by: ['saleDate'],
                where: {
                    warehouseId,
                    saleDate: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: {
                    totalAmount: true
                }
            });

            return c.json(dailySales);
        } catch (error) {
            console.error('Error fetching daily profits:', error);
            return c.json({ error: 'Failed to fetch daily profits' }, 500);
        }
    }
} 