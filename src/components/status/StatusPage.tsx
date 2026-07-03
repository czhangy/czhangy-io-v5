import GlitchText from '@/components/common/GlitchText/GlitchText';
import GamePanelLoader from './GamePanelLoader/GamePanelLoader';
import LocationPanelLoader from './LocationPanelLoader/LocationPanelLoader';
import SkillPanelLoader from './SkillPanelLoader/SkillPanelLoader';
import SpotifyPanel from './SpotifyPanel/SpotifyPanel';
import styles from './StatusPage.module.scss';
import WatchingPanelLoader from './WatchingPanelLoader/WatchingPanelLoader';

const StatusPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" className={styles.title} />
                <div className={styles.grid}>
                    <LocationPanelLoader cols={4} />
                    <SpotifyPanel cols={6} />
                    <WatchingPanelLoader cols={6} rows={3} />
                    <GamePanelLoader cols={5} />
                    <SkillPanelLoader cols={5} />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
