import Image from 'next/image';
import { SpotifyTrack } from '@/lib/utils/shared/types';
import SpotifyHelpers from '@/lib/utils/SpotifyHelpers';
import StatusPanel from '../StatusPanel/StatusPanel';
import styles from './SpotifyPanel.module.scss';

type SpotifyPanelProps = {
    className?: string;
};

const SpotifyPanel = async ({ className }: SpotifyPanelProps) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const track: SpotifyTrack | null = await SpotifyHelpers.getRecentlyPlayed();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel label="BLASTING" className={className}>
            {track ? (
                <a
                    className={styles.track}
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        className={styles['album-art']}
                        src={track.albumArt}
                        alt={`${track.name} album art`}
                        width={56}
                        height={56}
                    />
                    <div className={styles.info}>
                        <span className={styles.name}>{track.name}</span>
                        <span className={styles.artist}>{track.artist}</span>
                    </div>
                </a>
            ) : (
                <p className={styles.empty}>Nothing playing</p>
            )}
        </StatusPanel>
    );
};

export default SpotifyPanel;
