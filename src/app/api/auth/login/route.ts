import { NextRequest, NextResponse } from 'next/server';
import { signToken, verifyPassword } from '@/lib/utils/auth';
import { SESSION_COOKIE } from '@/lib/utils/constants';
import { prisma } from '@/lib/utils/prisma';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const POST = async (request: NextRequest) => {
    const { password } = await request.json();

    if (!password) {
        return NextResponse.json(
            { error: 'Password is required' },
            { status: 400 }
        );
    }

    const users = await prisma.user.findMany();

    for (const user of users) {
        const match = await verifyPassword(password, user.hashedPassword);

        if (match) {
            const token = await signToken({ id: user.id, role: user.role });
            const response = NextResponse.json({ role: user.role });

            response.cookies.set(SESSION_COOKIE, token, {
                httpOnly: true,
                maxAge: COOKIE_MAX_AGE,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });

            return response;
        }
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
};
