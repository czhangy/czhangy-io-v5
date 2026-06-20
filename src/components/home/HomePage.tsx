import NavMenu from './NavMenu/NavMenu';
import Title from './Title/Title';

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
                <Title />
            </div>
        </div>
    );
};

export default HomePage;
