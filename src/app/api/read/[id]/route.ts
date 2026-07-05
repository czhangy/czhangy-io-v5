import { NextRequest, NextResponse } from 'next/server';
import { READ_MILESTONES, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import AuthHelpers from '@/lib/utils/AuthHelpers';

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

    const countBefore = await prisma.books.count();
    await prisma.books.delete({ where: { id: parseInt(id) } });

    const milestone = READ_MILESTONES.find((m) => m.count === countBefore);
    if (milestone) {
        await prisma.achievements.deleteMany({
            where: { name: milestone.name },
        });
    }

    return NextResponse.json({ success: true });
};
