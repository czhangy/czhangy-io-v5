import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { WatchedMediaEntry } from '@/lib/static/types';
import WatchedContent from './WatchedContent/WatchedContent';
import styles from './WatchedPage.module.scss';

const WatchedPage = async () => {
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
        <div className={styles['watched-page']}>
            <div className={styles.content}>
                <GlitchText text="WATCHED" className={styles.title} />
                <WatchedContent initialEntries={entries} />
            </div>
        </div>
    );
};

export default WatchedPage;
