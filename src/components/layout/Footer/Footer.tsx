import GithubIcon from '@/lib/icons/GithubIcon';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <footer className={styles.footer}>
            <a
                className={styles.github}
                href="https://github.com/czhangy/czhangy-io-v5"
                target="_blank"
                rel="noopener noreferrer"
            >
                <GithubIcon />
            </a>
        </footer>
    );
};

export default Footer;
