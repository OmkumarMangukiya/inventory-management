import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { auth } from '../routes/auth';

export class WarehouseController {
    [x: string]: any;
    private prisma: PrismaClient;
    constructor(databaseUrl: string, jwtSecret: string) {
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
        const token = c.req.header('token');
        if (!token) return c.status(401).json({ error: 'Unauthorized' });

        const user = await auth(token);
        if (!user) return c.status(401).json({ error: 'Unauthorized' });

        const warehouses = await this.prisma.warehouse.findMany();
        return c.json(warehouses);
    }
} 