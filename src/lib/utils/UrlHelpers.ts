export default class UrlHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static isImageUrl = (url: string): boolean => {
        let parsed: URL;
        try {
            parsed = new URL(url);
        } catch {
            return false;
        }
        if (!['http:', 'https:'].includes(parsed.protocol)) return false;
        return /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i.test(
            parsed.pathname
        );
    };

    static isValidUrl = (url: string): boolean => {
        let parsed: URL;
        try {
            parsed = new URL(url);
        } catch {
            return false;
        }
        return ['http:', 'https:'].includes(parsed.protocol);
    };
}
