'use client';

import { useState } from 'react';
import MusicIcon from '@/lib/icons/MusicIcon';
import styles from './MusicPlayer.module.scss';

const MusicPlayer: React.FC = () => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleToggleClick = (): void => {
        setIsExpanded((prev) => !prev);
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            className={`${styles['music-player']} ${
                isExpanded ? styles['music-player--expanded'] : ''
            }`}
        >
            <button
                type="button"
                className={styles.toggle}
                onClick={handleToggleClick}
                aria-expanded={isExpanded}
                aria-label={
                    isExpanded ? 'Collapse music player' : 'Expand music player'
                }
            >
                <MusicIcon />
            </button>
            <div className={styles.content}>
                <span className={styles.placeholder}>Coming soon</span>
            </div>
        </div>
    );
};

export default MusicPlayer;
