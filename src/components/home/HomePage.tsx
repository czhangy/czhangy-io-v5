import GlitchText from '@/components/common/GlitchText/GlitchText';
import NavMenu from './NavMenu/NavMenu';

import styles from './HomePage.module.scss';

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
