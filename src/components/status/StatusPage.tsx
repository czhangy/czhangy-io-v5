import GlitchText from '@/components/common/GlitchText/GlitchText';
import WatchingPanelLoader from '@/components/status/WatchingPanel/WatchingPanelLoader/WatchingPanelLoader';
import GamePanelLoader from './GamePanel/GamePanelLoader/GamePanelLoader';
import LocationPanelLoader from './LocationPanel/LocationPanelLoader/LocationPanelLoader';
import SkillPanelLoader from './SkillPanel/SkillPanelLoader/SkillPanelLoader';
import SpotifyPanel from './SpotifyPanel/SpotifyPanel';
import styles from './StatusPage.module.scss';

const StatusPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" className={styles.title} />
                <div className={styles.grid}>
                    <LocationPanelLoader className={styles['cols-4']} />
                    <SpotifyPanel className={styles['cols-6']} />
                    <WatchingPanelLoader
                        className={`${styles['cols-6']} ${styles['rows-3']}`}
                    />
                    <GamePanelLoader className={styles['cols-5']} />
                    <SkillPanelLoader className={styles['cols-5']} />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
