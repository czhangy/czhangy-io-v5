import styles from './SocialLink.module.scss';

type SocialLinkProps = {
    href: string;
    icon: React.ReactNode;
};

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <a
            className={styles['social-link']}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
};

export default SocialLink;
