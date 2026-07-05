import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Book } from '@/lib/static/types';
import LibraryContent from './LibraryContent/LibraryContent';
import styles from './LibraryPage.module.scss';

const LibraryPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.books.findMany({
        orderBy: { addedAt: 'desc' },
    });

    const entries: Book[] = records.map((r) => ({
        name: r.name,
        author: r.author,
        bookId: r.bookId,
        cover: r.cover,
        genres: r.genres,
        addedAt: r.addedAt.toISOString(),
    }));

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['library-page']}>
            <div className={styles.content}>
                <GlitchText text="LIBRARY" className={styles.title} />
                <LibraryContent initialEntries={entries} />
            </div>
        </div>
    );
};

export default LibraryPage;
