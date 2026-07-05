import { prisma } from '@/lib/static/prisma';
import { Content } from '@/lib/static/types';
import ContentPanel from './ContentPanel/ContentPanel';

type ContentPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const ContentPanelData = async ({
    label,
    icon,
    cols,
    rows,
    mobileOrder,
}: ContentPanelDataProps) => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchRecentEntries = async (): Promise<Content[]> => {
        try {
            const records = await prisma.content.findMany({
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

    const entries: Content[] = await fetchRecentEntries();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <ContentPanel
            initialEntries={entries}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            mobileOrder={mobileOrder}
        />
    );
};

export default ContentPanelData;
