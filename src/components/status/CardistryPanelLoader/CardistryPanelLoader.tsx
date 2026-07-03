import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import CardsIcon from '@/lib/icons/CardsIcon';
import CardistryPanelData from './CardistryPanelData/CardistryPanelData';

type CardistryPanelLoaderProps = {
    cols: number;
    rows?: number;
};

const CardistryPanelLoader: React.FC<CardistryPanelLoaderProps> = ({
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'PRACTICING';
    const ICON: React.ReactNode = <CardsIcon />;

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
            <CardistryPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
            />
        </Suspense>
    );
};

export default CardistryPanelLoader;
