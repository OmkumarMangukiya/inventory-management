import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { useEffect } from "hono/jsx";
import { auth } from "./auth";
const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>()
const warehouse = app.post('/warehouse', async (c) => {
    const token = c.req.header('token');
    if(!token) return  c.status(401); c.json({error:'Unauthorized'});
    const user = await auth(token);
    if (!user) return c.status(401);c.json({ error: 'Unauthorized' });
    const  { userId ,username,role} = user;
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate());

    if(role === 'headmanager' || role  === 'owner'){
        const warehouseId = c.req.header('warehouseId');
        if(!warehouseId) return c.status(400);c.json({error:'warehouseId is required'});
        const products = await prisma.product.findMany({
            where:{
                warehouseIds: {
                    has: warehouseId
                }
            }
        })
        if(!products) return c.status(404);c.json({error:'products not found'});
        return  c.json(products);
    }
    else{
        const user =  await prisma.user.findUnique({
            where:{
                id : userId
            }
        })
        // console.log(user)
        const warehouseId = user?.warehouseIds[0];
        const products = await prisma.product.findMany({
            where:{
                warehouseIds:{
                    has:warehouseId
                }
            }
        })
        // console.log(products)
        if(!products) return c.status(404);c.json({error:'products not found'});
        return  c.json(products);
    }
})
export  default warehouse;