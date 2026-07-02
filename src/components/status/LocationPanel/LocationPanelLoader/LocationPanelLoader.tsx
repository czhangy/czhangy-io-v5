import { Suspense } from 'react';
import LocationIcon from '@/lib/icons/LocationIcon';
import StatusPanel from '../../StatusPanel/StatusPanel';
import LocationPanelData from '../LocationPanelData/LocationPanelData';

type LocationPanelLoaderProps = {
    className?: string;
};

const LocationPanelLoader: React.FC<LocationPanelLoaderProps> = ({
    className,
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
                    isLoading
                    className={className}
                />
            }
        >
            <LocationPanelData
                label={LABEL}
                icon={ICON}
                className={className}
            />
        </Suspense>
    );
};

export default LocationPanelLoader;
