import Link from 'next/link';
import GlitchText from '@/components/common/GlitchText/GlitchText';
import styles from './InfoPage.module.scss';

type InfoPageProps = {
    title: string;
    subtext: string;
};

const InfoPage: React.FC<InfoPageProps> = ({ title, subtext }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['info-page']}>
            <div className={styles.content}>
                <GlitchText text={title} className={styles.title} />
                <p className={styles.subtext}>{subtext}</p>
                <Link href="/" className={styles['home-link']}>
                    HOME
                </Link>
            </div>
        </div>
    );
};

export default InfoPage;
