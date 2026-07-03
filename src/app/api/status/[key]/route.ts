import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await params;
    const { value } = (await request.json()) as { value: string };

    if (!value?.trim()) {
        return NextResponse.json(
            { error: 'Value is required' },
            { status: 400 }
        );
    }

    const item = await prisma.statusItem.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });

    return NextResponse.json({ value: item.value });
};
