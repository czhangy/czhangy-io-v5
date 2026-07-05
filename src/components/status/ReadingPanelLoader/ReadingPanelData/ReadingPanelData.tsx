import { prisma } from '@/lib/static/prisma';
import { Book } from '@/lib/static/types';
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

    const fetchRecentEntries = async (): Promise<Book[]> => {
        try {
            const records = await prisma.books.findMany({
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

    const entries: Book[] = await fetchRecentEntries();

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
