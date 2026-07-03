import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import JoystickIcon from '@/lib/icons/JoystickIcon';
import GamePanelData from './GamePanelData/GamePanelData';

type GamePanelLoaderProps = {
    className?: string;
};

const GamePanelLoader: React.FC<GamePanelLoaderProps> = ({ className }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'GRINDING';
    const ICON: React.ReactNode = <JoystickIcon />;

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
            <GamePanelData label={LABEL} icon={ICON} className={className} />
        </Suspense>
    );
};

export default GamePanelLoader;
