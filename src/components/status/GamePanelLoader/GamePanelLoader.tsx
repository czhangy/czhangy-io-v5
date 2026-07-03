import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import JoystickIcon from '@/lib/icons/JoystickIcon';
import GamePanelData from './GamePanelData/GamePanelData';

type GamePanelLoaderProps = {
    cols: number;
    rows?: number;
};

const GamePanelLoader: React.FC<GamePanelLoaderProps> = ({ cols, rows }) => {
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
                    cols={cols}
                    rows={rows}
                    isLoading
                />
            }
        >
            <GamePanelData label={LABEL} icon={ICON} cols={cols} rows={rows} />
        </Suspense>
    );
};

export default GamePanelLoader;
