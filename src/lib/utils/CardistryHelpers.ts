export default class CardistryHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static getProficiency = (
        count: number
    ): { display: string; tier: number } => {
        if (count >= 10000) return { display: '10K/10K', tier: 3 };
        if (count >= 1000) return { display: `${count}/10K`, tier: 2 };
        if (count >= 100) return { display: `${count}/1000`, tier: 1 };
        return { display: `${count}/100`, tier: 0 };
    };
}
