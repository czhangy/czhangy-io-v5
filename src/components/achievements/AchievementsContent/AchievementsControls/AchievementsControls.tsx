'use client';

import { useState } from 'react';
import { useSession } from '@/lib/context/SessionContext';
import styles from './AchievementsControls.module.scss';
import AddAchievementModal from './AddAchievementModal/AddAchievementModal';

const AchievementsControls: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['achievements-controls']}>
            {role === 'ADMIN' ? (
                <button
                    className={styles['add-button']}
                    onClick={() => setIsOpen(true)}
                >
                    Add Achievement
                </button>
            ) : null}
            {isOpen ? (
                <AddAchievementModal onClose={() => setIsOpen(false)} />
            ) : null}
        </div>
    );
};

export default AchievementsControls;
