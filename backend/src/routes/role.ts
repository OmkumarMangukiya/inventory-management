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

const role = app.post('/role',async (c)=>{
    const roles = c.req.header('role');
    console.log("rol" + roles)
    if(roles == 'owner'){
        return c.json({headTo : 'warehouses'});
    }
    else if(roles == 'headmanager'){
        return c.json({headTo : 'warehouses'});
    }
    else if(roles == 'manager'){
        return c.json({headTo : 'warehouse'});
    }
})

export  default role;