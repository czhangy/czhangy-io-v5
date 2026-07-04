import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import TVIcon from '@/lib/icons/TVIcon';
import WatchingPanelData from './WatchingPanelData/WatchingPanelData';

type WatchingPanelLoaderProps = {
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const WatchingPanelLoader: React.FC<WatchingPanelLoaderProps> = ({
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
            <WatchingPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
                mobileOrder={mobileOrder}
            />
        </Suspense>
    );
};

export default WatchingPanelLoader;
