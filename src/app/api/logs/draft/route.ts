import { NextRequest, NextResponse } from 'next/server';
import { LOG_DRAFT_ID, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CreateLogParams } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const PUT = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, tags, body } = (await request.json()) as CreateLogParams;

    await prisma.logDraft.upsert({
        where: { id: LOG_DRAFT_ID },
        create: { id: LOG_DRAFT_ID, title, tags, body },
        update: { title, tags, body },
    });

    return NextResponse.json({ success: true });
};

export const DELETE = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.logDraft.deleteMany({ where: { id: LOG_DRAFT_ID } });

    return NextResponse.json({ success: true });
};
