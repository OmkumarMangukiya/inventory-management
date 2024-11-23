import { Hono } from "hono";

export class RoleController {
    public handleRole = async (c: any) => {
        const roles = c.req.header('role');
        if (roles === 'owner' || roles === 'headmanager') {
            return c.json({ headTo: 'warehouses' });
        } else if (roles === 'manager') {
            return c.json({ headTo: 'warehouse' });
        }
    }
} 