import { CreateJobParams, Job } from '@/lib/static/types';

export default class CareerHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static create = async (params: CreateJobParams): Promise<Job> => {
        const res = await fetch('/api/career', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create job.');
        }
        return (await res.json()) as Job;
    };

    static update = async (
        id: number,
        params: CreateJobParams
    ): Promise<Job> => {
        const res = await fetch(`/api/career/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save job.');
        }
        return (await res.json()) as Job;
    };

    static delete = async (id: number): Promise<boolean> => {
        const res = await fetch(`/api/career/${id}`, { method: 'DELETE' });
        return res.ok;
    };
}
