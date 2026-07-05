import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { WatchedMediaEntry } from '@/lib/static/types';
import ArchivesContent from './ArchivesContent/ArchivesContent';
import styles from './ArchivesPage.module.scss';

const ArchivesPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.watchedMedia.findMany({
        orderBy: { addedAt: 'desc' },
    });

    const entries: WatchedMediaEntry[] = records.map((r) => ({
        ...r,
        mediaType: r.mediaType as 'movie' | 'tv',
        addedAt: r.addedAt.toISOString(),
    }));

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['archives-page']}>
            <div className={styles.content}>
                <GlitchText text="ARCHIVES" className={styles.title} />
                <ArchivesContent initialEntries={entries} />
            </div>
        </div>
    );
};

export default ArchivesPage;
