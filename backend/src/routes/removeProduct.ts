import { Hono } from 'hono';
import { ProductController } from '../controllers/ProductController';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

app.delete('/removeproduct', async (c) => {
    const productController = new ProductController(c.env.DATABASE_URL);
    return await productController.removeProduct(c);
});

export default app; 