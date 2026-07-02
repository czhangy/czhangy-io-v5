import { Suspense } from 'react';
import StatusPanel from '../../StatusPanel/StatusPanel';
import GamePanelData from '../GamePanelData/GamePanelData';

type GamePanelLoaderProps = {
    icon?: React.ReactNode;
    className?: string;
};

const GamePanelLoader: React.FC<GamePanelLoaderProps> = ({
    icon,
    className,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Suspense
            fallback={
                <StatusPanel
                    label="GRINDING"
                    icon={icon}
                    isLoading
                    className={className}
                />
            }
        >
            <GamePanelData icon={icon} className={className} />
        </Suspense>
    );
};

export default GamePanelLoader;
