import { Hono } from 'hono'
import {signin} from './routes/sign'
const app = new Hono()

app.use('/users/signin',signin);

export default app
