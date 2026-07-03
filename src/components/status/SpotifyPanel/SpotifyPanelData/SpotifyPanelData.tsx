import Image from 'next/image';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { SpotifyTrack } from '@/lib/static/types';
import SpotifyHelpers from '@/lib/utils/SpotifyHelpers';
import styles from './SpotifyPanelData.module.scss';

type SpotifyPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const SpotifyPanelData = async ({
    label,
    icon,
    cols,
    rows,
}: SpotifyPanelDataProps) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const track: SpotifyTrack | null = await SpotifyHelpers.getRecentlyPlayed();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel label={label} icon={icon} cols={cols} rows={rows}>
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

export default SpotifyPanelData;
