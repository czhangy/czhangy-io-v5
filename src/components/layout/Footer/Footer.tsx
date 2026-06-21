import GithubIcon from '@/lib/icons/GithubIcon';
import styles from './Footer.module.scss';
import SocialLink from './SocialLink/SocialLink';

const Footer: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <footer className={styles.footer}>
            <SocialLink
                href="https://github.com/czhangy/czhangy-io-v5"
                icon={<GithubIcon />}
            />
        </footer>
    );
};

export default Footer;
