import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {signin,signup} from './routes/sign'
import role from './routes/role'
import warehouses  from './routes/warehouses'
import addWareshouse from './routes/addWarehouse'
import warehouse  from './routes/warehouse'
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
app.route('/',warehouse)
export default app
