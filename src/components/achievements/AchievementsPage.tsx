import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Achievement } from '@/lib/static/types';
import AchievementsContent from './AchievementsContent/AchievementsContent';
import styles from './AchievementsPage.module.scss';

const AchievementsPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.achievements.findMany({
        orderBy: { createdAt: 'asc' },
    });
    const achievements: Achievement[] = records.map((r) => ({
        tier: r.tier,
        name: r.name,
        category: r.category,
        description: r.description,
        date: r.date,
        createdAt: r.createdAt.toISOString(),
    }));

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
