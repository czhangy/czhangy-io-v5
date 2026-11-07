import { ROUTINE_TYPE } from '@/lib/static/constants';

export default class CardistryHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static isRoutine = (type: string): boolean => type === ROUTINE_TYPE;

    static getTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            'False Cut': 'F. Cut',
            'False Shuffle': 'F. Shuffle',
        };
        return labels[type] ?? type;
    };

    static getProficiency = (
        count: number
    ): { display: string; tier: number } => {
        if (count >= 10000) return { display: '10K/10K', tier: 3 };
        if (count >= 1000) return { display: `${count}/10K`, tier: 2 };
        if (count >= 100) return { display: `${count}/1000`, tier: 1 };
        return { display: `${count}/100`, tier: 0 };
    };
}
