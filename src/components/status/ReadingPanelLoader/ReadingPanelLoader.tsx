import BookIcon from '@/lib/icons/BookIcon';
import ReadingPanel from './ReadingPanel/ReadingPanel';

type ReadingPanelLoaderProps = {
    cols: number;
    rows?: number;
};

const ReadingPanelLoader: React.FC<ReadingPanelLoaderProps> = ({
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'READING';
    const ICON: React.ReactNode = <BookIcon />;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return <ReadingPanel label={LABEL} icon={ICON} cols={cols} rows={rows} />;
};

export default ReadingPanelLoader;
