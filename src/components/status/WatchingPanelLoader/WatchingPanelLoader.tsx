import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import TVIcon from '@/lib/icons/TVIcon';
import WatchingPanelData from './WatchingPanelData/WatchingPanelData';

type WatchingPanelLoaderProps = {
    className?: string;
};

const WatchingPanelLoader: React.FC<WatchingPanelLoaderProps> = ({
    className,
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
                    isLoading
                    className={className}
                />
            }
        >
            <WatchingPanelData
                label={LABEL}
                icon={ICON}
                className={className}
            />
        </Suspense>
    );
};

export default WatchingPanelLoader;
