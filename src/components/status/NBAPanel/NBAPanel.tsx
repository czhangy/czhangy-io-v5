import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import BasketballIcon from '@/lib/icons/BasketballIcon';
import NBAPanelData from './NBAPanelData/NBAPanelData';

type NBAPanelProps = {
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const NBAPanel: React.FC<NBAPanelProps> = ({ cols, rows, mobileOrder }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'BANDWAGONING';
    const ICON: React.ReactNode = <BasketballIcon />;

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
            <NBAPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
                mobileOrder={mobileOrder}
            />
        </Suspense>
    );
};

export default NBAPanel;
