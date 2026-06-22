import Image from 'next/image';
import { getRecentlyPlayed, SpotifyTrack } from '@/lib/utils/spotify';
import StatusPanel from '../StatusPanel/StatusPanel';
import styles from './SpotifyPanel.module.scss';

type SpotifyPanelProps = {
    className?: string;
};

const SpotifyPanel = async ({ className }: SpotifyPanelProps) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const track: SpotifyTrack | null = await getRecentlyPlayed();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel label="LISTENING TO" className={className}>
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
