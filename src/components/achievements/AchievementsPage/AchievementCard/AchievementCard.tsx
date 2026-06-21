'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import type { Achievement } from '@/generated/prisma/client';
import styles from './AchievementCard.module.scss';
import EditAchievementModal from './EditAchievementModal/EditAchievementModal';

type AchievementCardProps = {
    achievement: Achievement;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isEditing, setIsEditing] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEditOpen = (): void => setIsEditing(true);
    const handleEditClose = (): void => setIsEditing(false);

    const handleDelete = async (): Promise<void> => {
        await axios.delete(`/api/achievements/${achievement.id}`);
        router.refresh();
    };

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
            {role === 'ADMIN' ? (
                <div className={styles.buttons}>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={handleEditOpen}
                    >
                        <EditIcon />
                    </button>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={handleDelete}
                    >
                        <DeleteIcon />
                    </button>
                </div>
            ) : null}
            <div className={styles.header}>
                <span className={styles.name}>{achievement.name}</span>
                <span className={styles.date}>{achievement.date}</span>
            </div>
            <span className={styles.category}>{achievement.category}</span>
            <span className={styles.tier}>{tierStars}</span>
            <p className={styles.description}>{achievement.description}</p>
            {isEditing ? (
                <EditAchievementModal
                    achievement={achievement}
                    onClose={handleEditClose}
                />
            ) : null}
        </div>
    );
};

export default AchievementCard;
