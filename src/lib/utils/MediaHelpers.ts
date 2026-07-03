export default class MediaHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static prefersReducedMotion = (): boolean => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };
}
