'use client';

import { useEffect, useRef, useState } from 'react';
import MusicIcon from '@/lib/icons/MusicIcon';
import MuteIcon from '@/lib/icons/MuteIcon';
import SoundIcon from '@/lib/icons/SoundIcon';
import { MUSIC_TRACK } from '@/lib/static/constants';
import styles from './MusicPlayer.module.scss';

const MusicPlayer: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const audioRef = useRef<HTMLAudioElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleExpandToggleClick = (): void => {
        setIsExpanded((prev) => !prev);
    };

    const handleMuteToggleClick = (): void => {
        setIsMuted((prev) => !prev);
    };

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        audioRef.current?.play().catch(() => {});
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = isMuted;
        if (!isMuted) audio.play().catch(() => {});
    }, [isMuted]);

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
                onClick={handleExpandToggleClick}
                aria-expanded={isExpanded}
                aria-label={
                    isExpanded ? 'Collapse music player' : 'Expand music player'
                }
            >
                <MusicIcon />
            </button>
            <div className={styles.content}>
                <div className={styles.info}>
                    <span className={styles.title}>{MUSIC_TRACK.title}</span>
                    <span className={styles.source}>{MUSIC_TRACK.source}</span>
                </div>
                <button
                    type="button"
                    className={styles.mute}
                    onClick={handleMuteToggleClick}
                    aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                >
                    {isMuted ? <MuteIcon /> : <SoundIcon />}
                </button>
            </div>
            <audio ref={audioRef} src={MUSIC_TRACK.file} loop muted />
        </div>
    );
};

export default MusicPlayer;
