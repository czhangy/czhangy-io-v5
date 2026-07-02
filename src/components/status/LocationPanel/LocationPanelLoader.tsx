import { prisma } from '@/lib/utils/shared/prisma';
import LocationPanel from './LocationPanel';

type LocationPanelLoaderProps = {
    className?: string;
};

const LocationPanelLoader = async ({ className }: LocationPanelLoaderProps) => {
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

    return <LocationPanel initialLocation={location} className={className} />;
};

export default LocationPanelLoader;
