import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { ReadMediaEntry } from '@/lib/static/types';
import LibraryContent from './LibraryContent/LibraryContent';
import styles from './LibraryPage.module.scss';

const LibraryPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.readMedia.findMany({
        orderBy: { addedAt: 'desc' },
    });

    const entries: ReadMediaEntry[] = records.map((r) => ({
        ...r,
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
