import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/utils/jwt/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { ProductController } from '../controllers/ProductController';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();
const addProduct = app.post('/addproduct', async (c) => {
    const productController = new ProductController(c.env.DATABASE_URL);
    return await productController.addProduct(c);
});

export default addProduct;