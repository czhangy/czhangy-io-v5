export default class StringHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static isTitleCase = (str: string): boolean => {
        const words = str.trim().split(/\s+/).filter(Boolean);
        if (!words.length) return false;
        return words.every((word) => /^[A-Z]/.test(word));
    };

    static formatDuration = (seconds: number): string => {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };
}
