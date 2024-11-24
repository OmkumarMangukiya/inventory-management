import { Hono } from "hono";
import { SignatureKey } from "hono/utils/jwt/jws";
import { SalesController } from "../controllers/SalesController";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

app.post('/warehouseSales', async (c) => {
    console.log('Received warehouseSales request');
    const salesController = new SalesController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await salesController.createSale(c);
});

export default app;
