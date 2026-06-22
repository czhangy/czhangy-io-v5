import { ShowEntry } from '@/lib/utils';
import { prisma } from '@/lib/utils/prisma';
import { getShowById, TVmazeShow } from '@/lib/utils/tvmaze';
import type { StatusItem } from '@/generated/prisma/client';
import StatusPanel from '../StatusPanel/StatusPanel';
import ShowsPanelBody from './ShowsPanelBody/ShowsPanelBody';

const DEFAULT_ENTRIES: ShowEntry[] = [
    { name: '???', tvmazeId: -1 },
    { name: '???', tvmazeId: -1 },
    { name: '???', tvmazeId: -1 },
    { name: '???', tvmazeId: -1 },
];

type ShowsPanelProps = {
    className?: string;
};

const ShowsPanel = async ({ className }: ShowsPanelProps) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const showsItem: StatusItem | null = await prisma.statusItem.findUnique({
        where: { key: 'shows' },
    });
    const entries: ShowEntry[] = showsItem
        ? JSON.parse(showsItem.value)
        : DEFAULT_ENTRIES;
    const meta: (TVmazeShow | null)[] = await Promise.all(
        entries.map((e) => getShowById(e.tvmazeId))
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel label="BINGING" className={className}>
            <ShowsPanelBody initialEntries={entries} initialMeta={meta} />
        </StatusPanel>
    );
};

export default ShowsPanel;
