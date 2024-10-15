import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/utils/jwt/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

const addProduct = app.post('/addproduct', async (c) => {
    const warehouseId = c.req.header('warehouseId');
    if (!warehouseId) {
        c.status(400);
        return c.json({ error: 'Warehouse ID is required' });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());

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

    const productExist = await prisma.product.findFirst({
        where: {
            name: body.name,
            warehouseIds:{
                has :warehouseId
            }
        }
    });

    if (productExist) {
        const quan = productExist.qauntity + body.qauntity
        
       
            const product = await prisma.product.update({
                where: {
                    id: productExist.id
                },
                data: {
                    qauntity: quan
                }
            });
            await prisma.warehouse.update({
                where:{
                    id:warehouseId
                },
                data:{
                    totalstock:{
                        increment:body.qauntity
                    }
                }
            })
            return c.json({ message: 'Warehouse ID already exists in the product and updated', product });
        
        
    }  else {
        const product = await prisma.product.create({
            data: {
                name: body.name,
                price: body.price,
                qauntity: body.qauntity,
                expiry: parsedExpiry,
                warehouseIds: [warehouseId]
            }
        });
        await prisma.warehouse.update({
            where:{
                id:warehouseId
            },
            data:{
                totalstock:{
                    increment:body.qauntity
                }
            }
        })
        return c.json({ message: 'Product added successfully', product });
    }
});

export default addProduct;