import GlitchText from '@/components/common/GlitchText/GlitchText';
import GamePanelLoader from './GamePanel/GamePanelLoader';
import LocationPanelLoader from './LocationPanel/LocationPanelLoader';
import ShowsPanelLoader from './ShowsPanel/ShowsPanelLoader';
import SkillPanelLoader from './SkillPanel/SkillPanelLoader';
import SpotifyPanel from './SpotifyPanel/SpotifyPanel';
import styles from './StatusPage.module.scss';
import SuspendedPanel from './SuspendedPanel/SuspendedPanel';

const StatusPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" as="h1" className={styles.title} />
                <div className={styles.grid}>
                    <SuspendedPanel label="@" className={styles['cols-4']}>
                        <LocationPanelLoader className={styles['cols-4']} />
                    </SuspendedPanel>
                    <SuspendedPanel
                        label="BLASTING"
                        className={styles['cols-6']}
                    >
                        <SpotifyPanel className={styles['cols-6']} />
                    </SuspendedPanel>
                    <SuspendedPanel
                        label="BINGING"
                        className={`${styles['cols-6']} ${styles['rows-3']}`}
                    >
                        <ShowsPanelLoader
                            className={`${styles['cols-6']} ${styles['rows-3']}`}
                        />
                    </SuspendedPanel>
                    <SuspendedPanel
                        label="GRINDING"
                        className={styles['cols-5']}
                    >
                        <GamePanelLoader className={styles['cols-5']} />
                    </SuspendedPanel>
                    <SuspendedPanel
                        label="LEARNING"
                        className={styles['cols-5']}
                    >
                        <SkillPanelLoader className={styles['cols-5']} />
                    </SuspendedPanel>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
