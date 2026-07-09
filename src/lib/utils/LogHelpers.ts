export default class LogHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

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
