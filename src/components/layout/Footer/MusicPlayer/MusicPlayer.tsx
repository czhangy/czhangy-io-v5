'use client';

import { useEffect, useRef, useState } from 'react';
import MusicIcon from '@/lib/icons/MusicIcon';
import MuteIcon from '@/lib/icons/MuteIcon';
import NextIcon from '@/lib/icons/NextIcon';
import PauseIcon from '@/lib/icons/PauseIcon';
import PlayIcon from '@/lib/icons/PlayIcon';
import PreviousIcon from '@/lib/icons/PreviousIcon';
import SoundIcon from '@/lib/icons/SoundIcon';
import { MUSIC_TRACKS } from '@/lib/static/constants';
import { Track } from '@/lib/static/types';
import StringHelpers from '@/lib/utils/StringHelpers';
import styles from './MusicPlayer.module.scss';

const MusicPlayer: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const audioRef = useRef<HTMLAudioElement>(null);
    const isPlayingRef = useRef<boolean>(true);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [trackIndex, setTrackIndex] = useState<number>(0);
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
        setIsPlaying((prev) => !prev);
    };

    const handlePreviousClick = (): void => {
        setTrackIndex(
            (prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length
        );
    };

    const handleNextClick = (): void => {
        setTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
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

    const handleTrackEnd = (): void => {
        setTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const currentTrack: Track = MUSIC_TRACKS[trackIndex];
    const currentTimeLabel = StringHelpers.formatDuration(currentTime);
    const durationLabel = StringHelpers.formatDuration(duration);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

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
                <div className={styles.info}>
                    <span className={styles.title}>{currentTrack.title}</span>
                    <span className={styles.meta}>
                        {currentTrack.source} · {currentTimeLabel} /{' '}
                        {durationLabel}
                    </span>
                </div>
                <button
                    type="button"
                    className={styles.control}
                    onClick={handleMuteToggleClick}
                    aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                >
                    {isMuted ? <MuteIcon /> : <SoundIcon />}
                </button>
            </div>
            <audio
                ref={audioRef}
                src={currentTrack.file}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleTrackEnd}
                muted
            />
        </div>
    );
};

export default MusicPlayer;
