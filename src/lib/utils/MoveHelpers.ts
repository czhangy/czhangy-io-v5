import { Move } from '@/lib/static/types';

export default class MoveHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static list = async (): Promise<Move[] | null> => {
        const res = await fetch('/api/moves');
        return res.ok ? ((await res.json()) as Move[]) : null;
    };

    static create = async (params: {
        name: string;
        type: string;
        tutorial: string;
    }): Promise<Move> => {
        const res = await fetch('/api/moves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create move.');
        }
        return (await res.json()) as Move;
    };

    static update = async (
        name: string,
        params: { name: string; type: string; tutorial: string; count?: number }
    ): Promise<Move> => {
        const res = await fetch(`/api/moves/${encodeURIComponent(name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save move.');
        }
        return (await res.json()) as Move;
    };

    static highlight = async (name: string): Promise<Move | null> => {
        const res = await fetch(`/api/moves/${encodeURIComponent(name)}`, {
            method: 'PATCH',
        });
        return res.ok ? ((await res.json()) as Move) : null;
    };

    static delete = async (name: string): Promise<boolean> => {
        const res = await fetch(`/api/moves/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        return res.ok;
    };
}
