import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { Session } from './types';

const BCRYPT_ROUNDS = 12;
const JWT_EXPIRY = '7d';
const ALGORITHM = 'HS256';

const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');
    return new TextEncoder().encode(secret);
};

export const hashPassword = (password: string) => hash(password, BCRYPT_ROUNDS);

export const verifyPassword = (password: string, hashedPassword: string) =>
    compare(password, hashedPassword);

export const signToken = (session: Session) =>
    new SignJWT({ ...session })
        .setProtectedHeader({ alg: ALGORITHM })
        .setExpirationTime(JWT_EXPIRY)
        .sign(getSecret());

export const verifyToken = async (token: string): Promise<Session | null> => {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload as unknown as Session;
    } catch {
        return null;
    }
};
