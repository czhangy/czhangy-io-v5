import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/utils/prisma';
import LocationPanel from './LocationPanel/LocationPanel';
import ShowsPanel from './ShowsPanel/ShowsPanel';
import SpotifyPanel from './SpotifyPanel/SpotifyPanel';
import styles from './StatusPage.module.scss';

const StatusPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const location: string =
        (
            await prisma.statusItem.findUnique({
                where: { key: 'location' },
            })
        )?.value ?? 'Who Knows';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" as="h1" className={styles.title} />
                <div className={styles.grid}>
                    <LocationPanel
                        initialLocation={location}
                        className={styles['cols-2']}
                    />
                    <SpotifyPanel className={styles['cols-3']} />
                    <ShowsPanel
                        className={`${styles['cols-3']} ${styles['rows-3']}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
