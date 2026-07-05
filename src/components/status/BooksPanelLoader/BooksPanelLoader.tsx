import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import BookIcon from '@/lib/icons/BookIcon';
import BooksPanelData from './BooksPanelData/BooksPanelData';

type BooksPanelLoaderProps = {
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const BooksPanelLoader: React.FC<BooksPanelLoaderProps> = ({
    cols,
    rows,
    mobileOrder,
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
                    mobileOrder={mobileOrder}
                />
            }
        >
            <BooksPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
                mobileOrder={mobileOrder}
            />
        </Suspense>
    );
};

export default BooksPanelLoader;
