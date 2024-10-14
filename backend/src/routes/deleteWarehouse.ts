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

const deleteWarehouse = app.post('warehouses/delete', async (c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());
        
        const warehouseId  =  c.req.header('warehouseId');

        if (!warehouseId) {
            c.status(400); 
            return c.json({ error: "warehouseId is required" });
        }
        const deletedWarehouse = await prisma.warehouse.delete({
            where: { id: warehouseId },
        });
        
        

        await prisma.user.updateMany({
            where: {
                warehouseIds: {
                    has: warehouseId, 
                },
            },
            data: {
                warehouseIds: {
                    set: []
                },
            },
        });

        return c.json({ success: true, data: deletedWarehouse });

        


});

export default deleteWarehouse;