import { Suspense } from 'react';
import StatusPanel from '../../StatusPanel/StatusPanel';
import LocationPanelData from '../LocationPanelData/LocationPanelData';

type LocationPanelLoaderProps = {
    icon?: React.ReactNode;
    className?: string;
};

const LocationPanelLoader: React.FC<LocationPanelLoaderProps> = ({
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
                    label="LOCATION"
                    icon={icon}
                    isLoading
                    className={className}
                />
            }
        >
            <LocationPanelData icon={icon} className={className} />
        </Suspense>
    );
};

export default LocationPanelLoader;
