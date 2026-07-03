import GlitchText from '@/components/common/GlitchText/GlitchText';
import GamePanelLoader from './GamePanelLoader/GamePanelLoader';
import LocationPanelLoader from './LocationPanelLoader/LocationPanelLoader';
import ReadingPanelLoader from './ReadingPanelLoader/ReadingPanelLoader';
import SkillPanelLoader from './SkillPanelLoader/SkillPanelLoader';
import SpotifyPanel from './SpotifyPanel/SpotifyPanel';
import styles from './StatusPage.module.scss';
import VickyPanel from './VickyPanel/VickyPanel';
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
                    <ReadingPanelLoader cols={6} rows={2} />
                    <VickyPanel cols={4} rows={2} />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
