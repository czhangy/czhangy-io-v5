import Image from 'next/image';
import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import type { WatchedMedia } from '@/generated/prisma/client';
import styles from './WatchedPage.module.scss';

const WatchedPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const entries: WatchedMedia[] = await prisma.watchedMedia.findMany({
        orderBy: { addedAt: 'desc' },
    });

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['watched-page']}>
            <div className={styles.content}>
                <GlitchText text="WATCHED" className={styles.title} />
                <ul className={styles.list}>
                    {entries.map((entry) => (
                        <li key={entry.id} className={styles.item}>
                            {entry.poster ? (
                                <Image
                                    className={styles.poster}
                                    src={entry.poster}
                                    alt={`${entry.name} poster`}
                                    width={43}
                                    height={60}
                                />
                            ) : (
                                <div className={styles['poster-placeholder']} />
                            )}
                            <div className={styles.info}>
                                <span className={styles.name}>
                                    {entry.name}
                                </span>
                                {entry.genres.length > 0 ? (
                                    <div className={styles.genres}>
                                        {entry.genres.slice(0, 2).map((g) => (
                                            <span
                                                key={g}
                                                className={styles['genre-tag']}
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WatchedPage;
