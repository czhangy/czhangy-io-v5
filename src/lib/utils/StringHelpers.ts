export default class StringHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static isTitleCase = (str: string): boolean => {
        const words = str.trim().split(/\s+/).filter(Boolean);
        if (!words.length) return false;
        return words.every((word) => /^[A-Z]/.test(word));
    };
}
