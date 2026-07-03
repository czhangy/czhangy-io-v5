import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import BookIcon from '@/lib/icons/BookIcon';
import ReadingPanelData from './ReadingPanelData/ReadingPanelData';

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

    return (
        <Suspense
            fallback={
                <StatusPanel
                    label={LABEL}
                    icon={ICON}
                    cols={cols}
                    rows={rows}
                    isLoading
                />
            }
        >
            <ReadingPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
            />
        </Suspense>
    );
};

export default ReadingPanelLoader;
