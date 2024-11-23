import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/utils/jwt/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';

export class ProductController {
    private prisma: PrismaClient;
    constructor(databaseUrl: string) {
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl
                }
            }
        });
        this.prisma.$extends(withAccelerate());
    }

    public addProduct = async (c: any) => {
        const warehouseId = c.req.header('warehouseId');
        if (!warehouseId) {
            c.status(400);
            return c.json({ error: 'Warehouse ID is required' });
        }

        const token = c.req.header('token');
        if (!token) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        const user = verify(token, c.env.JWT_SECRET);
        if (!user) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        const body = await c.req.json();
        const { date } = body;

        // Log the received expiry date
        console.log('Received expiry date:', date);

        const parsedExpiry = new Date(date);
        if (isNaN(parsedExpiry.getTime())) {
            c.status(400);
            return c.json({ error: 'Invalid expiry date' });
        }

        const productExist = await this.prisma.product.findFirst({
            where: {
                name: body.name,
                warehouseIds: {
                    has: warehouseId
                }
            }
        });

        if (productExist) {
            const quan = productExist.quantity + body.quantity;

            const product = await this.prisma.product.update({
                where: {
                    id: productExist.id
                },
                data: {
                    quantity: quan
                }
            });
            await this.prisma.warehouse.update({
                where: {
                    id: warehouseId
                },
                data: {
                    totalstock: {
                        increment: body.quantity
                    }
                }
            });
            return c.json({ message: 'Warehouse ID already exists in the product and updated', product });
        } else {
            const product = await this.prisma.product.create({
                data: {
                    name: body.name,
                    price: body.price,
                    quantity: body.quantity,
                    expiry: parsedExpiry,
                    warehouseIds: [warehouseId]
                }
            });
            await this.prisma.warehouse.update({
                where: {
                    id: warehouseId
                },
                data: {
                    totalstock: {
                        increment: body.quantity
                    }
                }
            });
            return c.json({ message: 'Product added successfully', product });
        }
    }
} 