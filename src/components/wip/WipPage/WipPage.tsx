import Link from 'next/link';
import GlitchText from '@/components/common/GlitchText/GlitchText';
import styles from './WipPage.module.scss';

const WipPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['wip-page']}>
            <div className={styles.content}>
                <GlitchText text="WIP" as="h1" className={styles.title} />
                <p className={styles.subtext}>
                    This page is under construction.
                </p>
                <Link href="/" className={styles['home-link']}>
                    HOME
                </Link>
            </div>
        </div>
    );
};

export default WipPage;
