export default class DateHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static getDateString = (date: Date): string =>
        [
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
            date.getFullYear(),
        ].join('/');

    static getTodayString = (): string => DateHelpers.getDateString(new Date());

    static getDateObject = (dateStr: string): Date | null => {
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

    static getMMDDYYYY = (dateStr: string): string => {
        const parsed = DateHelpers.getDateObject(dateStr);
        if (!parsed) return dateStr;
        return DateHelpers.getDateString(parsed);
    };

    static isWithinDays = (isoDate: string, days: number): boolean => {
        const ms = 1000 * 60 * 60 * 24;
        return (Date.now() - new Date(isoDate).getTime()) / ms <= days;
    };

    static getHumanReadableDate = (dateStr: string): string =>
        new Date(dateStr)
            .toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'America/Los_Angeles',
            })
            .toUpperCase();

    static getUnixTimestamp = (dateStr: string | null): number => {
        if (!dateStr) return 0;
        const [month, day, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
    };

    static getMonthYear = (dateStr: string): string => {
        const parsed = DateHelpers.getDateObject(dateStr);
        if (!parsed) return dateStr;
        return parsed.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        });
    };
}
