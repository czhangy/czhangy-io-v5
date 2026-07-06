import GlitchText from '@/components/common/GlitchText/GlitchText';
import NewLogForm from './NewLogForm/NewLogForm';
import styles from './NewLogPage.module.scss';

const NewLogPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['new-log-page']}>
            <div className={styles.content}>
                <GlitchText text="NEW LOG" className={styles.title} />
                <NewLogForm />
            </div>
        </div>
    );
};

export default NewLogPage;
