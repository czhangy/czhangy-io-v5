import GlitchText from '@/components/common/GlitchText/GlitchText';
import LogsControls from './LogsControls/LogsControls';
import styles from './LogsPage.module.scss';

const LogsPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['logs-page']}>
            <div className={styles.content}>
                <GlitchText text="LOGS" className={styles.title} />
                <LogsControls />
            </div>
        </div>
    );
};

export default LogsPage;
