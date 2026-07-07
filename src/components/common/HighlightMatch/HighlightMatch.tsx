import styles from './HighlightMatch.module.scss';

type HighlightMatchProps = {
    text: string;
    query: string;
};

const HighlightMatch: React.FC<HighlightMatchProps> = ({ text, query }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type Segment = { value: string; matched: boolean };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const getSegments = (): Segment[] => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return [{ value: text, matched: false }];

        const lowerText = text.toLowerCase();
        const lowerQuery = trimmedQuery.toLowerCase();
        const segments: Segment[] = [];
        let cursor = 0;
        let matchIndex = lowerText.indexOf(lowerQuery, cursor);

        while (matchIndex !== -1) {
            if (matchIndex > cursor) {
                segments.push({
                    value: text.slice(cursor, matchIndex),
                    matched: false,
                });
            }
            segments.push({
                value: text.slice(matchIndex, matchIndex + trimmedQuery.length),
                matched: true,
            });
            cursor = matchIndex + trimmedQuery.length;
            matchIndex = lowerText.indexOf(lowerQuery, cursor);
        }

        if (cursor < text.length) {
            segments.push({ value: text.slice(cursor), matched: false });
        }

        return segments;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const segments: Segment[] = getSegments();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <>
            {segments.map((segment, index) =>
                segment.matched ? (
                    <span key={index} className={styles.match}>
                        {segment.value}
                    </span>
                ) : (
                    segment.value
                )
            )}
        </>
    );
};

export default HighlightMatch;
