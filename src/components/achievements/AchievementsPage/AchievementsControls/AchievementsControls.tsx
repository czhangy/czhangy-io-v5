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
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleOpen = (): void => setIsOpen(true);

    const handleClose = (): void => setIsOpen(false);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['achievements-controls']}>
            {role === 'ADMIN' ? (
                <button className={styles['add-button']} onClick={handleOpen}>
                    Add Achievement
                </button>
            ) : null}
            {isOpen ? <AddAchievementModal onClose={handleClose} /> : null}
        </div>
    );
};

export default AchievementsControls;
