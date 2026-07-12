import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import {
    ADMIN_NAV_ITEMS,
    AUTH_ROUTES,
    LOGGED_OUT_NAV_ITEMS,
    NAV_ITEMS,
} from '@/lib/static/constants';
import { NavItem, UserRole } from '@/lib/static/types';

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

    static signToken = (role: UserRole): Promise<string> => {
        return new SignJWT({ role })
            .setProtectedHeader({ alg: AuthHelpers.ALGORITHM })
            .setExpirationTime(AuthHelpers.JWT_EXPIRY)
            .sign(AuthHelpers.getSecret());
    };

    static verifyToken = async (token: string): Promise<UserRole | null> => {
        try {
            const { payload } = await jwtVerify(token, AuthHelpers.getSecret());
            return (payload as { role?: UserRole }).role ?? null;
        } catch {
            return null;
        }
    };

    static isProtectedRoute = (href: string): boolean => {
        return AUTH_ROUTES.some((route) => href.startsWith(route));
    };

    static login = async (password: string): Promise<void> => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (!res.ok) throw new Error('Invalid password.');
    };

    static register = async (password: string): Promise<void> => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create user.');
        }
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
