import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {signin,signup} from './routes/sign'
import role from './routes/role'
import warehouses  from './routes/warehouses'
import addWareshouse from './routes/addWarehouse'
import warehouse  from './routes/warehouse'
import deleteWarehouse from './routes/deleteWarehouse'
import addProduct  from './routes/addProduct'
import warehouseSales from './routes/warehouseSales'
const app = new Hono<{
    Bindings:{
        DATABASE_URL:String
    }
}>()
app.use('*',cors());
app.route('/users',signin);
app.route('/users',signup);
app.route('/users',role)
app.route('/',warehouses);
app.route('/',addWareshouse)
app.route('/warehouse', warehouse)
app.route('/',deleteWarehouse)
app.route('/',addProduct)
app.route('/',warehouseSales)
export default app
