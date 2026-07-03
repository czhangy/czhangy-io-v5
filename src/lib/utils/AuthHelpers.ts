import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import {
    ADMIN_NAV_ITEMS,
    AUTH_ROUTES,
    LOGGED_OUT_NAV_ITEMS,
    NAV_ITEMS,
} from '@/lib/static/constants';
import { NavItem, Session, UserRole } from './shared/types';

export default class AuthHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static readonly BCRYPT_ROUNDS = 12;
    private static readonly JWT_EXPIRY = '7d';
    private static readonly ALGORITHM = 'HS256';

    private static getSecret = (): Uint8Array => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not set');
        return new TextEncoder().encode(secret);
    };

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static hashPassword = (password: string): Promise<string> => {
        return hash(password, AuthHelpers.BCRYPT_ROUNDS);
    };

    static verifyPassword = (
        password: string,
        hashedPassword: string
    ): Promise<boolean> => {
        return compare(password, hashedPassword);
    };

    static signToken = (session: Session): Promise<string> => {
        return new SignJWT({ ...session })
            .setProtectedHeader({ alg: AuthHelpers.ALGORITHM })
            .setExpirationTime(AuthHelpers.JWT_EXPIRY)
            .sign(AuthHelpers.getSecret());
    };

    static verifyToken = async (token: string): Promise<Session | null> => {
        try {
            const { payload } = await jwtVerify(token, AuthHelpers.getSecret());
            return payload as unknown as Session;
        } catch {
            return null;
        }
    };

    static isProtectedRoute = (href: string): boolean => {
        return AUTH_ROUTES.some((route) => href.startsWith(route));
    };

    static computeNavItems = (
        isLoggedIn: boolean,
        role: UserRole | null
    ): NavItem[] => {
        if (!isLoggedIn) return LOGGED_OUT_NAV_ITEMS;
        if (role === 'ADMIN') return ADMIN_NAV_ITEMS;
        return NAV_ITEMS;
    };
}
