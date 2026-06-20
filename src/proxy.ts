import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { AUTH_ROUTES, SESSION_COOKIE } from '@/lib/utils/constants';

export const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const requiresAuth = AUTH_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!requiresAuth) return NextResponse.next();

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
