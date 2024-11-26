import { BaseController } from './BaseController';
import { Context } from 'hono';

// Abstract Product Controller (Inheritance)
export abstract class BaseProductController extends BaseController {
    // Protected methods specific to product operations
    protected async validateProduct(name: string, price: number, quantity: number): Promise<string | null> {
        if (!name || !price || !quantity) {
            return 'Name, price, and quantity are required';
        }
        if (price <= 0) {
            return 'Price must be greater than 0';
        }
        if (quantity < 0) {
            return 'Quantity cannot be negative';
        }
        return null;
    }

    // Abstract methods for product operations
    abstract addProduct(c: Context): Promise<any>;
    abstract updateProduct(c: Context): Promise<any>;
    abstract deleteProduct(c: Context): Promise<any>;
} 