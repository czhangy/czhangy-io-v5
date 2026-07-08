import GlitchText from '@/components/common/GlitchText/GlitchText';
import LogsContent from './LogsContent/LogsContent';
import styles from './LogsPage.module.scss';

const LogsPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['logs-page']}>
            <div className={styles.content}>
                <GlitchText text="LOGS" className={styles.title} />
                <LogsContent />
            </div>
        </div>
    );
};

export default LogsPage;
