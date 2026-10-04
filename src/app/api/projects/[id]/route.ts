import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Project } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

const authorize = async (request: NextRequest): Promise<boolean> => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;
    return role === 'ADMIN';
};

export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { name, description, icon, status, url } = (await request.json()) as {
        name: string;
        description: string;
        icon: string;
        status: string;
        url: string;
    };

    if (
        !name?.trim() ||
        !description?.trim() ||
        !icon?.trim() ||
        !status?.trim() ||
        !url?.trim()
    ) {
        return NextResponse.json(
            { error: 'All fields are required' },
            { status: 400 }
        );
    }

    let project;
    try {
        project = await prisma.projects.update({
            where: { id: Number(id) },
            data: {
                name: name.trim(),
                description: description.trim(),
                icon: icon.trim(),
                status: status.trim(),
                url: url.trim(),
            },
        });
    } catch (e) {
        if (
            (e as { code?: string }).code === 'P2002' ||
            (e as { code?: string }).code === '23505'
        ) {
            return NextResponse.json(
                {
                    error: 'A project with that name already exists.',
                },
                { status: 409 }
            );
        }
        throw e;
    }

    return NextResponse.json({
        id: project.id,
        name: project.name,
        description: project.description,
        icon: project.icon,
        status: project.status,
        url: project.url,
    } as Project);
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.projects.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
};
