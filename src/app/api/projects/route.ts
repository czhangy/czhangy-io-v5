import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Project } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        project = await prisma.projects.create({
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
