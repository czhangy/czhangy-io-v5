import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Move } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';

const authorize = async (request: NextRequest): Promise<boolean> => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;
    return role === 'ADMIN';
};

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const move = await prisma.moves.findUnique({
        where: { name: decodedName },
    });

    if (!move) {
        return NextResponse.json({ error: 'Move not found' }, { status: 404 });
    }

    await prisma.highlights.upsert({
        where: { key: 'move' },
        update: { value: move.name },
        create: { key: 'move', value: move.name },
    });

    return NextResponse.json({
        name: move.name,
        type: move.type,
        tutorial: move.tutorial,
        count: move.count,
        createdAt: move.createdAt.toISOString(),
    } as Move);
};

export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const {
        name: newName,
        type,
        tutorial,
        count,
    } = (await request.json()) as {
        name: string;
        type: string;
        tutorial: string;
        count: number;
    };

    if (!newName?.trim()) {
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
    if (!tutorial?.trim()) {
        return NextResponse.json(
            { error: 'Tutorial is required' },
            { status: 400 }
        );
    }
    if (typeof count !== 'number' || count < 0) {
        return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
    }

    const currentMove = await prisma.moves.findUnique({
        where: { name: decodedName },
    });
    if (!currentMove) {
        return NextResponse.json({ error: 'Move not found' }, { status: 404 });
    }

    const conflict = await prisma.moves.findUnique({
        where: { name: newName.trim() },
    });
    if (conflict && conflict.name !== decodedName) {
        return NextResponse.json(
            { error: 'Move already exists' },
            { status: 409 }
        );
    }

    const move = await prisma.moves.update({
        where: { name: decodedName },
        data: {
            name: newName.trim(),
            type: type.trim(),
            tutorial: tutorial.trim(),
            count,
        },
    });

    const tierThresholds = [
        { threshold: 100, label: 'Beginner', tier: 3 },
        { threshold: 1000, label: 'Proficient', tier: 2 },
        { threshold: 10000, label: 'Master', tier: 1 },
    ];
    const today = DateHelpers.getTodayString();

    for (const { threshold, label, tier } of tierThresholds) {
        if (currentMove.count < threshold && count >= threshold) {
            try {
                await prisma.achievements.create({
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
        name: move.name,
        type: move.type,
        tutorial: move.tutorial,
        count: move.count,
        createdAt: move.createdAt.toISOString(),
    } as Move);
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    await prisma.moves.delete({ where: { name: decodedName } });
    return NextResponse.json({ success: true });
};
