import { Jwt } from "hono/utils/jwt";
import { verify } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
const JWT_SECRET =  'secret';

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
}

export const auth = async (token: string): Promise<DecodedToken | null> => {
  try {
    const decoded = await verify(token, JWT_SECRET) as { userId: string; username: string; role: string };
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};