import Link from 'next/link';
import LinkIcon from '@/lib/icons/LinkIcon';
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
            <LinkIcon />
        </Link>
    );
};

export default LinkButton;
