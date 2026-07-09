import GithubIcon from '@/lib/icons/GithubIcon';
import styles from './Footer.module.scss';
import MusicPlayer from './MusicPlayer/MusicPlayer';

const Footer: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <footer className={styles.footer}>
            <MusicPlayer />
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
