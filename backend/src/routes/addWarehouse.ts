import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>()
const addWareshouse = app.post('addwarehouse',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const token  = c.req.header('token');
    if (!token) {
        return c.json({ error: "Token is missing" }, 400);
    }
    const decoded = await verify(token, c.env.JWT_SECRET);
    if (!decoded) {
        return c.json({ error: "Invalid token" }, 401);
    }
    const { id, username, role } = decoded as { id: string; username: string; role: string };
    let body;
    try {
        body = await c.req.json();
    } catch (error) {
        return c.json({ error: "Invalid JSON body" }, 400);
    }
    const warehouse = await prisma.warehouse.create({
        data: {
            name: body.name,
            location: body.location,
            totalstock:0
        }
    })
    const  user = await prisma.user.findFirst({
        where: {
            username : username
        }
    })
    if(!user){
        return  c.json({ error: "User not found" }, 404);
    }
    const updatedWarehouseIds  = [...user.warehouseIds,warehouse.id]
    const userupdate = await prisma.user.update({
        where:{
            id:id
        }
        ,data:{
            warehouseIds:updatedWarehouseIds
        }
    })
})
export  default addWareshouse;