import GlitchText from '@/components/common/GlitchText/GlitchText';
import CardistryIcon from '@/lib/icons/CardistryIcon';
import LocationIcon from '@/lib/icons/LocationIcon';
import GamePanelLoader from './GamePanel/GamePanelLoader/GamePanelLoader';
import LocationPanelLoader from './LocationPanel/LocationPanelLoader/LocationPanelLoader';
import ShowsPanelLoader from './ShowsPanel/ShowsPanelLoader/ShowsPanelLoader';
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
                <GlitchText text="STATUS" as="h1" className={styles.title} />
                <div className={styles.grid}>
                    <LocationPanelLoader
                        icon={<LocationIcon />}
                        className={styles['cols-4']}
                    />
                    <SpotifyPanel
                        icon={<CardistryIcon />}
                        className={styles['cols-6']}
                    />
                    <ShowsPanelLoader
                        icon={<CardistryIcon />}
                        className={`${styles['cols-6']} ${styles['rows-3']}`}
                    />
                    <GamePanelLoader
                        icon={<CardistryIcon />}
                        className={styles['cols-5']}
                    />
                    <SkillPanelLoader
                        icon={<CardistryIcon />}
                        className={styles['cols-5']}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
