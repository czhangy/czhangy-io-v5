import { prisma } from '@/lib/utils/shared/prisma';
import { ShowEntry, TVmazeShow } from '@/lib/utils/shared/types';
import TVmazeHelpers from '@/lib/utils/TVmazeHelpers';
import ShowsPanel from '../ShowsPanel';

type ShowsPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    className?: string;
};

const ShowsPanelData = async ({
    label,
    icon,
    className,
}: ShowsPanelDataProps) => {
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
        <ShowsPanel
            initialEntries={showEntries}
            initialMeta={showsMeta}
            label={label}
            icon={icon}
            className={className}
        />
    );
};

export default ShowsPanelData;
