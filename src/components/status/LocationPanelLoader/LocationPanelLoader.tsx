import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import LocationIcon from '@/lib/icons/LocationIcon';
import LocationPanelData from './LocationPanelData/LocationPanelData';

type LocationPanelLoaderProps = {
    cols: number;
    rows?: number;
};

const LocationPanelLoader: React.FC<LocationPanelLoaderProps> = ({
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'LOCATION';
    const ICON: React.ReactNode = <LocationIcon />;

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
            <LocationPanelData
                label={LABEL}
                icon={ICON}
                cols={cols}
                rows={rows}
            />
        </Suspense>
    );
};

export default LocationPanelLoader;
