import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/utils/prisma';
import type { Achievement } from '@/generated/prisma/client';
import AchievementCard from './AchievementCard/AchievementCard';
import AchievementsControls from './AchievementsControls/AchievementsControls';
import styles from './AchievementsPage.module.scss';

const AchievementsPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const achievements: Achievement[] = await prisma.achievement.findMany({
        orderBy: { createdAt: 'asc' },
    });

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['achievements-page']}>
            <div className={styles.content}>
                <GlitchText
                    text="ACHIEVEMENTS"
                    as="h1"
                    className={styles.title}
                />
                <AchievementsControls />
                <div className={styles.grid}>
                    {achievements.map((achievement) => (
                        <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
