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

    const users = await prisma.user.findMany({
        where: {
            warehouseIds: {
                has: warehouseId,
            },
        },
    });


    for (const user of users) {
        const updatedWarehouseIds = user.warehouseIds.filter(id => id !== warehouseId);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                warehouseIds: updatedWarehouseIds,
            },
        });
    }


   const products = await prisma.product.findMany({
        where: {
            warehouseIds: {
                has: warehouseId,
            },
        },
    });

    for (const product of products) {
        await prisma.product.delete({
            where: {
                id: product.id,
            },
        });
    }

   
   
    await prisma.warehouse.delete({
        where: {
            id: warehouseId,
        },
    });
    
        return c.json({ success: true});

        
    

});

export default deleteWarehouse;