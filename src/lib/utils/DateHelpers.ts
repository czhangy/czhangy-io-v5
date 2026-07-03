export default class DateHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static getTodayStrin = (): string => {
        const d = new Date();
        return [
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0'),
            d.getFullYear(),
        ].join('/');
    };

    static parseLooseDate = (dateStr: string): Date | null => {
        const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
        if (!match) return null;
        const [, m, d, y] = match;
        const year = y.length === 2 ? 2000 + parseInt(y) : parseInt(y);
        const month = parseInt(m);
        const day = parseInt(d);
        const parsed = new Date(year, month - 1, day);
        if (
            parsed.getFullYear() !== year ||
            parsed.getMonth() !== month - 1 ||
            parsed.getDate() !== day
        )
            return null;
        return parsed;
    };

    static normalizeDate = (dateStr: string): string => {
        const parsed = DateHelpers.parseLooseDate(dateStr);
        if (!parsed) return dateStr;
        return [
            String(parsed.getMonth() + 1).padStart(2, '0'),
            String(parsed.getDate()).padStart(2, '0'),
            parsed.getFullYear(),
        ].join('/');
    };

    static parseDateNumber = (dateStr: string | null): number => {
        if (!dateStr) return 0;
        const [month, day, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
    };
}
