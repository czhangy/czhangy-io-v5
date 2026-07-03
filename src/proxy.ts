import { NextRequest, NextResponse } from 'next/server';
import {
    ADMIN_ROUTES,
    AUTH_ROUTES,
    SESSION_COOKIE,
} from '@/lib/static/constants';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!isAuthRoute && !isAdminRoute) return NextResponse.next();

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (isAuthRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && session?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
