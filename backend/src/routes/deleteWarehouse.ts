import { Hono } from "hono";
import { SignatureKey } from "hono/utils/jwt/jws";
import { WarehouseController } from "../controllers/WarehouseController";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

app.post('/warehouses/delete', async (c) => {
    const warehouseController = new WarehouseController(c.env.DATABASE_URL, c.env.JWT_SECRET);
    return await warehouseController.deleteWarehouse(c);
});

export default app;