import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/utils/prisma';
import LocationPanel from './LocationPanel/LocationPanel';
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
        )?.value ?? 'Seattle, WA';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" as="h1" className={styles.title} />
                <div className={styles.grid}>
                    <LocationPanel initialLocation={location} />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
