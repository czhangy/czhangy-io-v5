import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';

const authorize = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;
    return session?.role === 'ADMIN' ? session : null;
};

const parseId = (id: string) => {
    const n = parseInt(id, 10);
    return isNaN(n) ? null : n;
};

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseId(id);
    if (numericId === null) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const existingItem = await prisma.statusItem.findUnique({
        where: { key: 'cardistryMove' },
    });

    if (existingItem) {
        await prisma.statusItem.update({
            where: { key: 'cardistryMove' },
            data: { value: String(numericId) },
        });
    } else {
        await prisma.statusItem.create({
            data: { key: 'cardistryMove', value: String(numericId) },
        });
    }

    const move = await prisma.cardistryMove.findUnique({
        where: { id: numericId },
    });

    if (!move) {
        return NextResponse.json({ error: 'Move not found' }, { status: 404 });
    }

    return NextResponse.json({
        ...move,
        createdAt: move.createdAt.toISOString(),
    } as CardistryMoveEntry);
};

export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseId(id);
    if (numericId === null) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const { name, type, count } = (await request.json()) as {
        name: string;
        type: string;
        count: number;
    };

    if (!name?.trim()) {
        return NextResponse.json(
            { error: 'Name is required' },
            { status: 400 }
        );
    }
    if (!type?.trim()) {
        return NextResponse.json(
            { error: 'Type is required' },
            { status: 400 }
        );
    }
    if (typeof count !== 'number' || count < 0) {
        return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
    }

    const currentMove = await prisma.cardistryMove.findUnique({
        where: { id: numericId },
    });
    if (!currentMove) {
        return NextResponse.json({ error: 'Move not found' }, { status: 404 });
    }

    const conflict = await prisma.cardistryMove.findUnique({
        where: { name: name.trim() },
    });
    if (conflict && conflict.id !== numericId) {
        return NextResponse.json(
            { error: 'Move already exists' },
            { status: 409 }
        );
    }

    const move = await prisma.cardistryMove.update({
        where: { id: numericId },
        data: { name: name.trim(), type: type.trim(), count },
    });

    const tierThresholds = [
        { threshold: 100, label: 'Beginner', tier: 1 },
        { threshold: 1000, label: 'Proficient', tier: 2 },
        { threshold: 10000, label: 'Master', tier: 3 },
    ];
    const today = DateHelpers.getTodayString();

    for (const { threshold, label, tier } of tierThresholds) {
        if (currentMove.count < threshold && count >= threshold) {
            try {
                await prisma.achievement.create({
                    data: {
                        tier,
                        name: `${move.name} ${label}`,
                        category: 'Hobbies',
                        description: `Perform ${threshold} ${move.name}s.`,
                        date: today,
                    },
                });
            } catch (e) {
                if (
                    (e as { code?: string }).code !== 'P2002' &&
                    (e as { code?: string }).code !== '23505'
                ) {
                    throw e;
                }
            }
        }
    }

    return NextResponse.json({
        ...move,
        createdAt: move.createdAt.toISOString(),
    } as CardistryMoveEntry);
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseId(id);
    if (numericId === null) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await prisma.cardistryMove.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
};
