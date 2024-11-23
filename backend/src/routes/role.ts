import { Hono } from "hono";
import { SignatureKey } from "hono/utils/jwt/jws";
import { RoleController } from "../controllers/RoleController";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

app.post('/role', async (c) => {
    const roleController = new RoleController();
    return await roleController.handleRole(c);
});

export default app;