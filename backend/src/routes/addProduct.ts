import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/utils/jwt/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';
import warehouse from './warehouse';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: SignatureKey
    }
}>();
const addProduct = app.post('addproduct',async(c)=>{
    const warehouseId = c.req.header('warehouseId')
    
    const prisma=  new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const productExist =await prisma.product.findFirst({
        where:{
            name:body.name
        }
    })
    if(productExist){
        if(!warehouseId) {c.status(400); return c.json({"error":"warehouse"})} 
        const updatedWarehouseIds = [...productExist.warehouseIds,warehouseId]
        const  product = await prisma.product.update({
            where:{
                id:productExist.id
            },
            data:{
                qauntity:{
                    increment:body.qauntity
                },
                warehouseIds: updatedWarehouseIds
            }
        })
    }
    else{
        
        const product = await prisma.product.create({
        data: {
            name: body.name,
            price: body.price,
            qauntity: body.quantity,
            expiry: new Date(body.expiry),
            warehouseIds: warehouseId ? [warehouseId] : []
        }
    })}
})