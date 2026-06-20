import Link from 'next/link';
import GlitchText from '@/components/common/GlitchText/GlitchText';
import styles from './StatusPage.module.scss';

type StatusPageProps = {
    title: string;
    subtext: string;
};

const StatusPage: React.FC<StatusPageProps> = ({ title, subtext }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text={title} as="h1" className={styles.title} />
                <p className={styles.subtext}>{subtext}</p>
                <Link href="/" className={styles['home-link']}>
                    HOME
                </Link>
            </div>
        </div>
    );
};

export default StatusPage;
