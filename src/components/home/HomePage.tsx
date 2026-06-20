import GlitchText from '@/components/common/GlitchText/GlitchText';
import GithubIcon from '@/lib/icons/GithubIcon';
import styles from './HomePage.module.scss';
import NavMenu from './NavMenu/NavMenu';
import SocialLink from './SocialLink/SocialLink';

const HomePage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['home-page']}>
            <div className={styles['left-panel']}>
                <NavMenu />
            </div>
            <div className={styles['right-panel']}>
                <GlitchText
                    text="CZHANGY.IO"
                    as="h1"
                    className={styles.title}
                />
            </div>
            <div className={styles['social-links']}>
                <SocialLink
                    href="https://github.com/czhangy/czhangy-io-v5"
                    icon={<GithubIcon />}
                />
            </div>
        </div>
    );
};

export default HomePage;
