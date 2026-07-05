import { prisma } from '@/lib/static/prisma';
import { Book } from '@/lib/static/types';
import BooksPanel from './BooksPanel/BooksPanel';

type BooksPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const BooksPanelData = async ({
    label,
    icon,
    cols,
    rows,
    mobileOrder,
}: BooksPanelDataProps) => {
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
                name: r.name,
                author: r.author,
                bookId: r.bookId,
                cover: r.cover,
                genres: r.genres,
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
        <BooksPanel
            initialEntries={entries}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            mobileOrder={mobileOrder}
        />
    );
};

export default BooksPanelData;
