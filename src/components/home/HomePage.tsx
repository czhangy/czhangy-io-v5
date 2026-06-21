import GlitchText from '@/components/common/GlitchText/GlitchText';
import styles from './HomePage.module.scss';
import NavMenu from './NavMenu/NavMenu';

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
        </div>
    );
};

export default HomePage;
