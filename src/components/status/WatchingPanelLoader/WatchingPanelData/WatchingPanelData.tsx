import { prisma } from '@/lib/static/prisma';
import { ShowEntry, TVmazeShow } from '@/lib/static/types';
import TVmazeHelpers from '@/lib/utils/TVmazeHelpers';
import WatchingPanel from './WatchingPanel/WatchingPanel';

type WatchingPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const WatchingPanelData = async ({
    label,
    icon,
    cols,
    rows,
}: WatchingPanelDataProps) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_SHOW_ENTRIES: ShowEntry[] = [
        { name: '???', tvmazeId: -1 },
        { name: '???', tvmazeId: -1 },
        { name: '???', tvmazeId: -1 },
        { name: '???', tvmazeId: -1 },
    ];

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchShowEntries = async (): Promise<ShowEntry[]> => {
        try {
            const item = await prisma.statusItem.findUnique({
                where: { key: 'shows' },
            });
            if (item) return JSON.parse(item.value) as ShowEntry[];
        } catch {}
        return DEFAULT_SHOW_ENTRIES;
    };

    const fetchShowsMeta = async (
        entries: ShowEntry[]
    ): Promise<(TVmazeShow | null)[]> => {
        try {
            return await Promise.all(
                entries.map((e) => TVmazeHelpers.getShowById(e.tvmazeId))
            );
        } catch {}
        return entries.map(() => null);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const showEntries: ShowEntry[] = await fetchShowEntries();
    const showsMeta: (TVmazeShow | null)[] = await fetchShowsMeta(showEntries);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <WatchingPanel
            initialEntries={showEntries}
            initialMeta={showsMeta}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
        />
    );
};

export default WatchingPanelData;
