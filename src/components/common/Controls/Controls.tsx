import Link from 'next/link';
import Pagination from '@/components/common/Pagination/Pagination';
import styles from './Controls.module.scss';

type ControlsProps = {
    backLink?: {
        href: string;
        label: string;
    };
    left?: React.ReactNode;
    search?: {
        value: string;
        placeholder: string;
        onChange: (value: string) => void;
    };
    add?: {
        label: string;
        isAdmin: boolean;
        onClick: () => void;
    };
    pagination?: {
        page: number;
        totalPages: number;
        onPrev: () => void;
        onNext: () => void;
    };
    children?: React.ReactNode;
};

const Controls: React.FC<ControlsProps> = ({
    backLink,
    left,
    search,
    add,
    pagination,
    children,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        search?.onChange(e.target.value);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const hasLeading = Boolean(backLink) || Boolean(left) || Boolean(add);
    const hasTrailing = Boolean(search) || Boolean(pagination);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles.controls}>
            {hasLeading ? (
                <div className={styles.leading}>
                    {backLink ? (
                        <Link
                            className={styles['back-link']}
                            href={backLink.href}
                        >
                            {backLink.label}
                        </Link>
                    ) : null}
                    {left ? <div className={styles.left}>{left}</div> : null}
                    {add?.isAdmin ? (
                        <button
                            className={styles['add-button']}
                            type="button"
                            onClick={add.onClick}
                        >
                            {add.label}
                        </button>
                    ) : null}
                </div>
            ) : null}
            {hasTrailing ? (
                <div className={styles.trailing}>
                    {search ? (
                        <input
                            className={styles.search}
                            type="text"
                            value={search.value}
                            onChange={handleSearchChange}
                            placeholder={search.placeholder}
                        />
                    ) : null}
                    {pagination ? (
                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            onPrev={pagination.onPrev}
                            onNext={pagination.onNext}
                        />
                    ) : null}
                </div>
            ) : null}
            {children}
        </div>
    );
};

export default Controls;
