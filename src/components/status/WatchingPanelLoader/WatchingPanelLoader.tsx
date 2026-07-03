import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import TVIcon from '@/lib/icons/TVIcon';
import WatchingPanelData from './WatchingPanelData/WatchingPanelData';

type WatchingPanelLoaderProps = {
    cols: number;
    rows?: number;
};

const WatchingPanelLoader: React.FC<WatchingPanelLoaderProps> = ({
    cols,
    rows,
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
                />
            }
        >
            <WatchingPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
            />
        </Suspense>
    );
};

export default WatchingPanelLoader;
