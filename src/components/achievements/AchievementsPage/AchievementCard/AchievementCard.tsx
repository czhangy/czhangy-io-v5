import type { Achievement } from '@/generated/prisma/client';
import styles from './AchievementCard.module.scss';

type AchievementCardProps = {
    achievement: Achievement;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const tierStars: string =
        '★'.repeat(4 - achievement.tier) + '☆'.repeat(achievement.tier - 1);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['achievement-card']}>
            <div className={styles.header}>
                <span className={styles.name}>{achievement.name}</span>
                <span className={styles.date}>{achievement.date}</span>
            </div>
            <span className={styles.tier}>{tierStars}</span>
            <span className={styles.category}>{achievement.category}</span>
            <p className={styles.description}>{achievement.description}</p>
        </div>
    );
};

export default AchievementCard;
