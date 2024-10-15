import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

const warehouseSales = app.post('warehouseSales', async (c) => {
    const warehouseId = c.req.header('warehouseId');
    const body = await c.req.json();
    const { productName, soldQuantity } = body;

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());

    const product = await prisma.product.findFirst({
        where: {
            name: productName,
            warehouseIds: {
                has: warehouseId
            }
        }
    });

    if (!product) return c.json({ error: 'Product not found' }, 404);

    
    if (product.qauntity - soldQuantity <= 0) {
        
        const res = await prisma.product.delete({
            where: {
                id: product.id
            }
        });
        const res1 = await prisma.warehouse.update({
            where: {
                id: warehouseId
            },
            data: {
                totalstock: {
                    decrement: product.qauntity 
                }
            }
        });

        return c.json(res);
    } else {
        const res = await prisma.product.update({
            where: {
                id: product.id,
            },
            data: {
                qauntity: {
                    decrement: soldQuantity 
                }
            }
        });
        const res1 = await prisma.warehouse.update({
            where: {
                id: warehouseId
            },
            data: {
                totalstock: {
                    decrement: soldQuantity
                }
            }
        });

        return c.json(res);
    }
});

export default warehouseSales;
