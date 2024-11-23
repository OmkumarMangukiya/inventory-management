import { verify } from 'hono/utils/jwt/jwt';
import { SignatureKey } from 'hono/utils/jwt/jws';

export class AuthController {
    private jwtSecret: SignatureKey;

    constructor(jwtSecret: SignatureKey) {
        this.jwtSecret = jwtSecret;
    }

    public authenticate = async (token: string) => {
        try {
            const decoded = await verify(token, this.jwtSecret) as { userId: string; username: string; role: string };
            return decoded;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
} 