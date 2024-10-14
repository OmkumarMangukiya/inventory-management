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

const warehouses = app.get('warehouses', async (c) => {
    const role = c.req.header('role');
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    try {
        const wh = await prisma.warehouse.findMany();
        if (wh.length === 0) {
          console.log('No warehouses found.');
        }
        return c.json(wh);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        return c.json({ error: 'Error fetching warehouses' }, 500);
      }

})
export default warehouses;