import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import TVIcon from '@/lib/icons/TVIcon';
import ContentPanelData from './ContentPanelData/ContentPanelData';

type ContentPanelLoaderProps = {
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const ContentPanelLoader: React.FC<ContentPanelLoaderProps> = ({
    cols,
    rows,
    mobileOrder,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'WATCHING';
    const ICON: React.ReactNode = <TVIcon />;

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
            <ContentPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
                mobileOrder={mobileOrder}
            />
        </Suspense>
    );
};

export default ContentPanelLoader;
