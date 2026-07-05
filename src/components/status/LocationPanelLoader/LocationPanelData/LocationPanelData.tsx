import { prisma } from '@/lib/static/prisma';
import LocationPanel from './LocationPanel/LocationPanel';

type LocationPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const LocationPanelData = async ({
    label,
    icon,
    cols,
    rows,
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
            const item = await prisma.highlights.findUnique({
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
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
        />
    );
};

export default LocationPanelData;
