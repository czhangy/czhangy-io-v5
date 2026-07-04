import { prisma } from '@/lib/static/prisma';
import { ReadMediaEntry } from '@/lib/static/types';
import ReadingPanel from './ReadingPanel/ReadingPanel';

type ReadingPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const ReadingPanelData = async ({
    label,
    icon,
    cols,
    rows,
    mobileOrder,
}: ReadingPanelDataProps) => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchRecentEntries = async (): Promise<ReadMediaEntry[]> => {
        try {
            const records = await prisma.readMedia.findMany({
                orderBy: { addedAt: 'desc' },
                take: 3,
            });
            return records.map((r) => ({
                ...r,
                addedAt: r.addedAt.toISOString(),
            }));
        } catch {}
        return [];
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const entries: ReadMediaEntry[] = await fetchRecentEntries();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <ReadingPanel
            initialEntries={entries}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            mobileOrder={mobileOrder}
        />
    );
};

export default ReadingPanelData;
