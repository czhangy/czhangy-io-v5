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
                <h1 className={styles.title}>CZHANGY.IO</h1>
            </div>
        </div>
    );
};

export default HomePage;
