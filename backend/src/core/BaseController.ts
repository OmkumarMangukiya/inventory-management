import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { SignatureKey } from 'hono/utils/jwt/jws';
import { Context } from 'hono';

// Abstract base controller class (Abstraction)
export abstract class BaseController {
    protected prisma?: PrismaClient;
    protected jwtSecret: SignatureKey;

    constructor(jwtSecret: SignatureKey, databaseUrl?: string) {
        if (databaseUrl) {
            const prismaClient = new PrismaClient({
                datasources: {
                    db: {
                        url: databaseUrl
                    }
                }
            });
            this.prisma = prismaClient.$extends(withAccelerate()) as unknown as PrismaClient;
        }
        this.jwtSecret = jwtSecret;
    }

    // Protected methods for common operations (Encapsulation)
    protected async handleError(error: unknown, message: string): Promise<{ error: string, details: string }> {
        console.error(`Error in ${message}:`, error);
        return {
            error: message,
            details: error instanceof Error ? error.message : 'Unknown error'
        };
    }

    // Abstract methods that must be implemented by child classes (Polymorphism)
    abstract validateRequest(c: Context): Promise<boolean>;
} 