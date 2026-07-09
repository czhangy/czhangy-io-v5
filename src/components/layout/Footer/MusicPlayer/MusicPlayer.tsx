'use client';

import { useEffect, useRef, useState } from 'react';
import MusicIcon from '@/lib/icons/MusicIcon';
import MuteIcon from '@/lib/icons/MuteIcon';
import NextIcon from '@/lib/icons/NextIcon';
import PauseIcon from '@/lib/icons/PauseIcon';
import PlayIcon from '@/lib/icons/PlayIcon';
import PreviousIcon from '@/lib/icons/PreviousIcon';
import SoundIcon from '@/lib/icons/SoundIcon';
import { MUSIC_TRACKS } from '@/lib/static/tracks';
import { Track } from '@/lib/static/types';
import StringHelpers from '@/lib/utils/StringHelpers';
import styles from './MusicPlayer.module.scss';

const MusicPlayer: React.FC = () => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const NO_REPEAT_WINDOW = 10;

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const audioRef = useRef<HTMLAudioElement>(null);
    const isPlayingRef = useRef<boolean>(false);
    const initialTrackIndexRef = useRef<number>(0);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [history, setHistory] = useState<number[]>([0]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleExpandToggleClick = (): void => {
        setIsExpanded((prev) => !prev);
    };

    const handleMuteToggleClick = (): void => {
        setIsMuted((prev) => !prev);
    };

    const handlePlayPauseClick = (): void => {
        const next = !isPlaying;
        setIsPlaying(next);
        if (next) setIsMuted(false);
    };

    const handlePreviousClick = (): void => {
        setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    const handleNextClick = (): void => {
        setHistory((prev) => {
            const excludeCount = Math.min(
                NO_REPEAT_WINDOW,
                MUSIC_TRACKS.length - 1
            );
            const excluded = new Set(prev.slice(-excludeCount));
            const candidates = MUSIC_TRACKS.map((_, i) => i).filter(
                (i) => !excluded.has(i)
            );
            const next =
                candidates[Math.floor(Math.random() * candidates.length)];
            return [...prev, next];
        });
    };

    const handleTimeUpdate = (
        e: React.SyntheticEvent<HTMLAudioElement>
    ): void => {
        setCurrentTime(e.currentTarget.currentTime);
    };

    const handleLoadedMetadata = (
        e: React.SyntheticEvent<HTMLAudioElement>
    ): void => {
        setDuration(e.currentTarget.duration);
        setCurrentTime(e.currentTarget.currentTime);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const trackIndex = history[history.length - 1];
    const currentTrack: Track = MUSIC_TRACKS[trackIndex];
    const currentTimeLabel = StringHelpers.formatDuration(currentTime);
    const durationLabel = StringHelpers.formatDuration(duration);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        initialTrackIndexRef.current = Math.floor(
            Math.random() * MUSIC_TRACKS.length
        );
        setHistory([initialTrackIndexRef.current]);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.08;
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.load();
        if (isPlayingRef.current) audio.play().catch(() => {});
    }, [trackIndex]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;

        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) audio.play().catch(() => {});
        else audio.pause();
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = isMuted;
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
                <div className={styles.inner}>
                    <div className={styles.info}>
                        <span className={styles.title}>
                            {currentTrack.title}
                        </span>
                        <span className={styles.meta}>
                            {currentTrack.source} · {currentTimeLabel} /{' '}
                            {durationLabel}
                        </span>
                    </div>
                    <div className={styles.controls}>
                        <button
                            type="button"
                            className={styles.control}
                            onClick={handlePreviousClick}
                            aria-label="Previous track"
                        >
                            <PreviousIcon />
                        </button>
                        <button
                            type="button"
                            className={`${styles.control} ${styles['control--primary']}`}
                            onClick={handlePlayPauseClick}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <button
                            type="button"
                            className={styles.control}
                            onClick={handleNextClick}
                            aria-label="Next track"
                        >
                            <NextIcon />
                        </button>
                        <button
                            type="button"
                            className={styles.control}
                            onClick={handleMuteToggleClick}
                            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                        >
                            {isMuted ? <MuteIcon /> : <SoundIcon />}
                        </button>
                    </div>
                </div>
            </div>
            <audio
                ref={audioRef}
                src={currentTrack.file}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleNextClick}
                muted
            />
        </div>
    );
};

export default MusicPlayer;
