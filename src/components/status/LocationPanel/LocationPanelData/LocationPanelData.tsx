import { prisma } from '@/lib/utils/shared/prisma';
import LocationPanel from '../LocationPanel';

type LocationPanelDataProps = {
    icon?: React.ReactNode;
    className?: string;
};

const LocationPanelData = async ({
    icon,
    className,
}: LocationPanelDataProps) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_LOCATION: string = 'Somewhere';

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchLocation = async (): Promise<string> => {
        try {
            const item = await prisma.statusItem.findUnique({
                where: { key: 'location' },
            });
            if (item) return item.value;
        } catch {}
        return DEFAULT_LOCATION;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const location: string = await fetchLocation();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <LocationPanel
            initialLocation={location}
            icon={icon}
            className={className}
        />
    );
};

export default LocationPanelData;
