import { Hono } from 'hono';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { SalesController } from '../controllers/SalesController';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

app.post('/sales', async (c) => {
    const salesController = new SalesController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await salesController.createSale(c);
});

app.get('/sales/history', async (c) => {
    const salesController = new SalesController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await salesController.getSalesHistory(c);
});

app.get('/sales/:id', async (c) => {
    const salesController = new SalesController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await salesController.getSaleDetails(c);
});

export default app; 