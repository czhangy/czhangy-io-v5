import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import {
    ADMIN_NAV_ITEMS,
    AUTH_ROUTES,
    LOGGED_OUT_NAV_ITEMS,
    NAV_ITEMS,
    SESSION_MAX_AGE,
    SESSION_REFRESH_AFTER,
} from '@/lib/static/constants';
import { NavItem, UserRole } from '@/lib/static/types';

export default class AuthHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static readonly BCRYPT_ROUNDS = 12;
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
            .setIssuedAt()
            .setExpirationTime(`${SESSION_MAX_AGE}s`)
            .sign(AuthHelpers.getSecret());
    };

    static getSessionCookieOptions = () => ({
        httpOnly: true,
        maxAge: SESSION_MAX_AGE,
        path: '/',
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
    });

    // Returns the role and whether the token is old enough to be re-issued
    // (sliding session: active users stay logged in).
    static getSession = async (
        token: string
    ): Promise<{ role: UserRole; shouldRefresh: boolean } | null> => {
        try {
            const { payload } = await jwtVerify(token, AuthHelpers.getSecret());
            const role = (payload as { role?: UserRole }).role;
            if (!role) return null;
            const age = Math.floor(Date.now() / 1000) - (payload.iat ?? 0);
            return { role, shouldRefresh: age > SESSION_REFRESH_AFTER };
        } catch {
            return null;
        }
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

    // Only same-origin relative paths are allowed, so a crafted callbackUrl
    // can't redirect to another site after login.
    static getSafeCallbackUrl = (callbackUrl: string | null): string => {
        if (
            !callbackUrl ||
            !callbackUrl.startsWith('/') ||
            callbackUrl.startsWith('//') ||
            callbackUrl.startsWith('/\\') ||
            callbackUrl.startsWith('/login')
        ) {
            return '/';
        }
        return callbackUrl;
    };

    static computeNavItems = (
        isLoggedIn: boolean,
        role: UserRole | null,
        currentPath?: string
    ): NavItem[] => {
        if (!isLoggedIn) {
            if (!currentPath || currentPath === '/') {
                return LOGGED_OUT_NAV_ITEMS;
            }
            return LOGGED_OUT_NAV_ITEMS.map((item) =>
                item.href === '/login'
                    ? {
                          ...item,
                          href: `/login?callbackUrl=${encodeURIComponent(currentPath)}`,
                      }
                    : item
            );
        }
        if (role === 'ADMIN') return ADMIN_NAV_ITEMS;
        return NAV_ITEMS;
    };
}
