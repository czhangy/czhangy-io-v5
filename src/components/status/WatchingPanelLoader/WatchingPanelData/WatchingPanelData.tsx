import { prisma } from '@/lib/static/prisma';
import { WatchedMediaEntry } from '@/lib/static/types';
import WatchingPanel from './WatchingPanel/WatchingPanel';

type WatchingPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const WatchingPanelData = async ({
    label,
    icon,
    cols,
    rows,
    mobileOrder,
}: WatchingPanelDataProps) => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchRecentEntries = async (): Promise<WatchedMediaEntry[]> => {
        try {
            const records = await prisma.watchedMedia.findMany({
                orderBy: { addedAt: 'desc' },
                take: 5,
            });
            return records.map((r) => ({
                ...r,
                mediaType: r.mediaType as 'movie' | 'tv',
                addedAt: r.addedAt.toISOString(),
            }));
        } catch {}
        return [];
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const entries: WatchedMediaEntry[] = await fetchRecentEntries();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <WatchingPanel
            initialEntries={entries}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            mobileOrder={mobileOrder}
        />
    );
};

export default WatchingPanelData;
