import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CreateLogParams } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { title, tags, body } = (await request.json()) as CreateLogParams;

    if (!title?.trim() || !body?.trim()) {
        return NextResponse.json(
            { error: 'Title and body are required' },
            { status: 400 }
        );
    }

    try {
        const record = await prisma.logs.update({
            where: { id: Number(id) },
            data: { title, tags, body },
        });
        return NextResponse.json({ success: true, slug: record.slug });
    } catch {
        return NextResponse.json(
            { error: 'A log with that title already exists' },
            { status: 409 }
        );
    }
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.logs.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
};
