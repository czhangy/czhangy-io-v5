import { CreateLogParams } from '@/lib/static/types';

export default class LogHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static create = async (params: CreateLogParams): Promise<void> => {
        const res = await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to publish log.');
        }
    };

    static update = async (
        id: number,
        params: CreateLogParams
    ): Promise<void> => {
        const res = await fetch(`/api/logs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save log.');
        }
    };

    static delete = async (id: number): Promise<boolean> => {
        const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
        return res.ok;
    };

    static saveDraft = async (params: CreateLogParams): Promise<void> => {
        await fetch('/api/logs/draft', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
    };

    static deleteDraft = async (): Promise<void> => {
        await fetch('/api/logs/draft', { method: 'DELETE' });
    };

    static slugify = (title: string): string => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    static getExcerpt = (html: string, maxLength: number = 160): string => {
        const text = html
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (text.length <= maxLength) return text;
        const truncated = text.slice(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
    };
}
