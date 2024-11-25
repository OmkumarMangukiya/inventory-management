import { Hono } from 'hono';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { DashboardController } from '../controllers/DashboardController';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

app.get('/stats', async (c) => {
    const dashboardController = new DashboardController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await dashboardController.getWarehouseStats(c);
});

app.get('/profits', async (c) => {
    const dashboardController = new DashboardController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await dashboardController.getDailyProfits(c);
});

export default app; 