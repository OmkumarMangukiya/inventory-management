import { Hono } from "hono";
import { SignatureKey } from "hono/utils/jwt/jws";
import { SignController } from "../controllers/SignController";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();

// Create a new instance of SignController for each request
export const signup = app.post('/signup', async (c) => {
    const signController = new SignController(c);
    return await signController.signup(c);
});

export const signin = app.post('/signin', async (c) => {
    const signController = new SignController(c);
    return await signController.signin(c);
});

export default app;