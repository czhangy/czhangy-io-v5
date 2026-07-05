import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import type { Achievement } from '@/prisma/generated/client';
import AchievementsContent from './AchievementsContent/AchievementsContent';
import styles from './AchievementsPage.module.scss';

const AchievementsPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const achievements: Achievement[] = await prisma.achievements.findMany({
        orderBy: { createdAt: 'asc' },
    });

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['achievements-page']}>
            <div className={styles.content}>
                <GlitchText text="ACHIEVEMENTS" className={styles.title} />
                <AchievementsContent achievements={achievements} />
            </div>
        </div>
    );
};

export default AchievementsPage;
