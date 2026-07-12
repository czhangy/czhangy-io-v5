import { CreateAchievementParams } from '@/lib/static/types';

export default class AchievementHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static create = async (params: CreateAchievementParams): Promise<void> => {
        const res = await fetch('/api/achievements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create achievement.');
        }
    };

    static update = async (
        name: string,
        params: CreateAchievementParams
    ): Promise<void> => {
        const res = await fetch(
            `/api/achievements/${encodeURIComponent(name)}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            }
        );
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save achievement.');
        }
    };

    static delete = async (name: string): Promise<void> => {
        await fetch(`/api/achievements/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
    };
}
