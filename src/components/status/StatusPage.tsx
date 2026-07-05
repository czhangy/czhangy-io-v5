import GlitchText from '@/components/common/GlitchText/GlitchText';
import CardistryPanelLoader from './CardistryPanelLoader/CardistryPanelLoader';
import GamePanelLoader from './GamePanelLoader/GamePanelLoader';
import LocationPanelLoader from './LocationPanelLoader/LocationPanelLoader';
import NBAPanel from './NBAPanel/NBAPanel';
import ReadingPanelLoader from './ReadingPanelLoader/ReadingPanelLoader';
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
                    <LocationPanelLoader cols={5} />
                    <GamePanelLoader cols={5} />
                    <WatchingPanelLoader cols={6} rows={3} mobileOrder={5} />
                    <CardistryPanelLoader cols={5} />
                    <SpotifyPanel cols={5} />
                    <ReadingPanelLoader cols={6} rows={2} mobileOrder={6} />
                    <VickyPanel cols={4} rows={2} mobileOrder={7} />
                    <NBAPanel cols={6} mobileOrder={4} />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
