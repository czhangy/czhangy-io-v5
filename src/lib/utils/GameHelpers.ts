import { Game } from '@/lib/static/types';

export default class GameHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static list = async (): Promise<Game[] | null> => {
        const res = await fetch('/api/games');
        return res.ok ? ((await res.json()) as Game[]) : null;
    };

    static create = async (params: Game): Promise<Game> => {
        const res = await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create game.');
        }
        return (await res.json()) as Game;
    };

    static update = async (name: string, params: Game): Promise<Game> => {
        const res = await fetch(`/api/games/${encodeURIComponent(name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save game.');
        }
        return (await res.json()) as Game;
    };

    static delete = async (name: string): Promise<boolean> => {
        const res = await fetch(`/api/games/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        return res.ok;
    };
}
