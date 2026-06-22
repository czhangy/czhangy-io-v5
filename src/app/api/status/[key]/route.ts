import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { SESSION_COOKIE } from '@/lib/utils/constants';
import { prisma } from '@/lib/utils/prisma';

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

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
