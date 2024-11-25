import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {signin,signup} from './routes/sign'
import role from './routes/role'
import warehouses from './routes/warehouses'
import addWareshouse from './routes/addWarehouse'
import warehouse from './routes/warehouse'
import deleteWarehouse from './routes/deleteWarehouse'
import addProduct from './routes/addProduct'
import warehouseSales from './routes/warehouseSales'
import salesRoutes from './routes/sales'
import shiftProduct from './routes/shiftProduct'

const app = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

app.use('*', cors());
app.route('/users', signin);
app.route('/users', signup);
app.route('/users', role);
app.route('/', warehouses);
app.route('/', addWareshouse);
app.route('/warehouse', warehouse);
app.route('/warehouses', deleteWarehouse);
app.route('/', addProduct);
app.route('/', warehouseSales);
app.route('/', salesRoutes);
app.route('/warehouse', shiftProduct);

export default app
