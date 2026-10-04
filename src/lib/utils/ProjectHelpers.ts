import { CreateProjectParams, Project } from '@/lib/static/types';

export default class ProjectHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static create = async (params: CreateProjectParams): Promise<Project> => {
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create project.');
        }
        return (await res.json()) as Project;
    };

    static update = async (
        id: number,
        params: CreateProjectParams
    ): Promise<Project> => {
        const res = await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save project.');
        }
        return (await res.json()) as Project;
    };

    static delete = async (id: number): Promise<boolean> => {
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        return res.ok;
    };
}
