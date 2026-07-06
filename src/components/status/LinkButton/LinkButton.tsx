import Link from 'next/link';
import PageLinkIcon from '@/lib/icons/PageLinkIcon';
import styles from './LinkButton.module.scss';

type LinkButtonProps = {
    href: string;
};

const LinkButton: React.FC<LinkButtonProps> = ({ href }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Link href={href} className={styles.button}>
            <PageLinkIcon />
        </Link>
    );
};

export default LinkButton;
