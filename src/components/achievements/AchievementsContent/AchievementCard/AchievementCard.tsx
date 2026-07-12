'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HighlightMatch from '@/components/common/HighlightMatch/HighlightMatch';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import { Achievement } from '@/lib/static/types';
import AchievementHelpers from '@/lib/utils/AchievementHelpers';
import styles from './AchievementCard.module.scss';
import EditAchievementModal from './EditAchievementModal/EditAchievementModal';

type AchievementCardProps = {
    achievement: Achievement;
    searchQuery: string;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    searchQuery,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();
    const { role } = useSession();
    const cardRef = useRef<HTMLDivElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleDelete = async (): Promise<void> => {
        await AchievementHelpers.delete(achievement.name);
        router.refresh();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const tierStars: string =
        '★'.repeat(4 - achievement.tier) + '☆'.repeat(achievement.tier - 1);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent): void => {
            if (!cardRef.current?.contains(e.target as Node)) {
                setIsSelected(false);
            }
        };
        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            ref={cardRef}
            className={`${styles['achievement-card']}${isSelected ? ` ${styles['achievement-card--selected']}` : ''}`}
            onClick={() => setIsSelected(true)}
        >
            {role === 'ADMIN' ? (
                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => setIsEditing(true)}
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
                <span className={styles.name}>
                    <HighlightMatch
                        text={achievement.name}
                        query={searchQuery}
                    />
                </span>
                <span className={styles.date}>{achievement.date}</span>
            </div>
            <span className={styles.category}>{achievement.category}</span>
            <span className={styles.tier}>{tierStars}</span>
            <p className={styles.description}>{achievement.description}</p>
            {isEditing ? (
                <EditAchievementModal
                    achievement={achievement}
                    onClose={() => setIsEditing(false)}
                />
            ) : null}
        </div>
    );
};

export default AchievementCard;
