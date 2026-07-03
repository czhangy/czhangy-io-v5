import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password } = (await request.json()) as { password: string };

    if (!password) {
        return NextResponse.json(
            { error: 'Password is required' },
            { status: 400 }
        );
    }

    const hashedPassword = await AuthHelpers.hashPassword(password);
    await prisma.user.create({ data: { hashedPassword, role: 'USER' } });

    return NextResponse.json({ success: true });
};
