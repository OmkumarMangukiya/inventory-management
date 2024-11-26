import { Hono } from 'hono';
import { verify } from 'hono/utils/jwt/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { ShiftController } from '../controllers/ShiftController';

const shiftProduct = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

shiftProduct.post('/shiftproduct', async (c) => {
    const token = c.req.header('token');
    const sourceWarehouseId = c.req.header('warehouseId');
    const targetWarehouseId = c.req.header('targetWarehouseId');

    if (!token) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }

    if (!sourceWarehouseId || !targetWarehouseId) {
        c.status(400);
        return c.json({ error: 'Both source and target warehouse IDs are required' });
    }

    if (sourceWarehouseId === targetWarehouseId) {
        c.status(400);
        return c.json({ error: 'Source and target warehouses must be different' });
    }

    try {
        const user = verify(token, c.env.JWT_SECRET);
        if (!user) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        const shiftController = new ShiftController(c.env.DATABASE_URL);
        return await shiftController.shiftProduct(c);
    } catch (error) {
        console.error('Authentication error:', error);
        c.status(401);
        return c.json({ error: 'Authentication failed' });
    }
});

export default shiftProduct;
