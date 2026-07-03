import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import HeadphonesIcon from '@/lib/icons/HeadphonesIcon';
import SpotifyPanelData from './SpotifyPanelData/SpotifyPanelData';

type SpotifyPanelProps = {
    cols: number;
    rows?: number;
};

const SpotifyPanel: React.FC<SpotifyPanelProps> = ({ cols, rows }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'BLASTING';
    const ICON: React.ReactNode = <HeadphonesIcon />;

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
            <SpotifyPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
            />
        </Suspense>
    );
};

export default SpotifyPanel;
