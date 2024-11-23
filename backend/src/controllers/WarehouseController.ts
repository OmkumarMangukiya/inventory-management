import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { verify } from 'hono/utils/jwt/jwt';

export class WarehouseController {
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

    public getWarehouses = async (c: any) => {
        try {
            const warehouses = await this.prisma.warehouse.findMany();
            if (warehouses.length === 0) {
                console.log('No warehouses found.');
            }
            return c.json(warehouses);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            return c.json({ error: 'Error fetching warehouses' }, 500);
        }
    }

    public deleteWarehouse = async (c: any) => {
        const warehouseId = c.req.header('warehouseId');
        if (!warehouseId) {
            c.status(400);
            return c.json({ error: "warehouseId is required" });
        }

        try {
            // Update users
            const users = await this.prisma.user.findMany({
                where: { warehouseIds: { has: warehouseId } }
            });

            for (const user of users) {
                const updatedWarehouseIds = user.warehouseIds.filter(id => id !== warehouseId);
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: { warehouseIds: updatedWarehouseIds }
                });
            }

            // Delete associated products
            await this.prisma.product.deleteMany({
                where: { warehouseIds: { has: warehouseId } }
            });

            // Delete warehouse
            await this.prisma.warehouse.delete({
                where: { id: warehouseId }
            });

            return c.json({ success: true });
        } catch (error) {
            return c.json({ error: 'Failed to delete warehouse' }, 500);
        }
    }

    public recordSales = async (c: any) => {
        const warehouseId = c.req.header('warehouseId');
        if (!warehouseId) {
            c.status(400);
            return c.json({ error: 'Warehouse ID is required' });
        }

        const body = await c.req.json();
        const { productName, soldquantity } = body;

        if (!productName || !soldquantity) {
            c.status(400);
            return c.json({ error: 'Product name and quantity are required' });
        }

        if (soldquantity <= 0) {
            c.status(400);
            return c.json({ error: 'Quantity must be greater than 0' });
        }

        const product = await this.prisma.product.findFirst({
            where: {
                name: productName,
                warehouseIds: { has: warehouseId }
            }
        });

        if (!product) return c.json({ error: 'Product not found' }, 404);

        if (product.quantity < soldquantity) {
            return c.json({ error: 'Not enough quantity available' }, 400);
        }

        try {
                if (product.quantity - soldquantity <= 0) {
                const res = await this.prisma.product.delete({
                    where: { id: product.id }
                });
                await this.prisma.warehouse.update({
                    where: { id: warehouseId },
                    data: { totalstock: { decrement: product.quantity } }
                });
                return c.json(res);
            } else {
                const res = await this.prisma.product.update({
                    where: { id: product.id },
                    data: { quantity: { decrement: soldquantity } }
                });
                await this.prisma.warehouse.update({
                    where: { id: warehouseId },
                    data: { totalstock: { decrement: soldquantity } }
                });
                return c.json(res);
            }
        } catch (error) {
            console.error('Error recording sales:', error);
            return c.json({ error: 'Failed to record sales' }, 500);
        }
    }

    public create = async (c: any) => {
        try {
            const body = await c.req.json();
            const { name, location } = body;

            if (!name || !location) {
                c.status(400);
                return c.json({ error: "Name and location are required" });
            }

            const warehouse = await this.prisma.warehouse.create({
                data: {
                    name,
                    location,
                    totalstock: 0
                }
            });

            return c.json({ 
                message: 'Warehouse created successfully',
                warehouse 
            });
        } catch (error) {
            console.error('Error creating warehouse:', error);
            return c.json({ error: 'Failed to create warehouse' }, 500);
        }
    }

    public getWarehouseProducts = async (c: any) => {
        const warehouseId = c.req.header('warehouseId');
        
        if (!warehouseId) {
            c.status(400);
            return c.json({ error: "warehouseId is required" });
        }

        try {
            const products = await this.prisma.product.findMany({
                where: {
                    warehouseIds: {
                        has: warehouseId
                    }
                }
            });

            // Always return an array, even if empty
            return c.json(products || []);
        } catch (error) {
            console.error('Error fetching warehouse products:', error);
            return c.json([]); // Return empty array on error
        }
    }
} 