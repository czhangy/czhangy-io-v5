import GlitchText from '@/components/common/GlitchText/GlitchText';
import styles from './StatusPage.module.scss';

const StatusPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" as="h1" className={styles.title} />
            </div>
        </div>
    );
};

export default StatusPage;
