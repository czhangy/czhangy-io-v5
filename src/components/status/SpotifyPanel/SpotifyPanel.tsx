import { Suspense } from 'react';
import HeadphonesIcon from '@/lib/icons/HeadphonesIcon';
import StatusPanel from '../StatusPanel/StatusPanel';
import SpotifyPanelData from './SpotifyPanelData/SpotifyPanelData';

type SpotifyPanelProps = {
    className?: string;
};

const SpotifyPanel: React.FC<SpotifyPanelProps> = ({ className }) => {
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
                    isLoading
                    className={className}
                />
            }
        >
            <SpotifyPanelData label={LABEL} icon={ICON} className={className} />
        </Suspense>
    );
};

export default SpotifyPanel;
