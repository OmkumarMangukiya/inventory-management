import { BaseController } from './BaseController';
import { Context } from 'hono';

// Abstract Warehouse Controller (Inheritance)
export abstract class BaseWarehouseController extends BaseController {
    // Protected methods specific to warehouse operations
    protected async validateWarehouse(name: string, location: string): Promise<string | null> {
        if (!name || !location) {
            return 'Name and location are required';
        }
        return null;
    }

    // Abstract methods for warehouse operations
    abstract getWarehouses(c: Context): Promise<any>;
    abstract addWarehouse(c: Context): Promise<any>;
    abstract deleteWarehouse(c: Context): Promise<any>;
} 