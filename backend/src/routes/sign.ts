import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>()

export const signup = app.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: (c.env as { DATABASE_URL: string }).DATABASE_URL
    }).$extends(withAccelerate())

    let body;
    try {
        body = await c.req.json();
    } catch (error) {
        return c.json({ error: "Invalid JSON body" }, 400);
    }


    if (!body.username || !body.email || !body.password || !body.role) {
        return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            username: body.username
        }
    });

    if (existingUser) {
        return c.json({ error: "Username already exists" }, 400);
    }

    // Create a new user
    const user = await prisma.user.create({
        data: {
            email: body.email,
            username: body.username,
            password: body.password,
            role: body.role,
        }
    });


    const token: string = await sign({ userId: user.id, username: user.username, role: user.role }, c.env.JWT_SECRET);
    c.res.headers.set('Set-Cookie', `token=${token}; role=${user.role}; HttpOnly`);
    return c.json({ msg: "Signup Completed", token, id: user.id ,role: user.role});
});

export const signin = app.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: (c.env as { DATABASE_URL: string }).DATABASE_URL
    }).$extends(withAccelerate())

    let body;
    try {
        body = await c.req.json();
    } catch (error) {
        return c.json({ error: "Invalid JSON body" }, 400);
    }


    if (!body.username || !body.password) {
        return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: {
            username: body.username,
            password: body.password
        }
    });

    if (!user || user.password !== body.password) {
        return c.json({ error: "Invalid username or password" }, 400);
    }

    const token: string = await sign({ userId: user.id, username: user.username, role: user.role }, c.env.JWT_SECRET);
    c.res.headers.set('Set-Cookie', `token=${token}; role=${user.role}; HttpOnly`);
    return c.json({ msg: "Signin Successful", token, id: user.id ,role: user.role});
});

export default app;