import Link from 'next/link';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import Pagination from '@/components/common/Pagination/Pagination';
import FilterIcon from '@/lib/icons/FilterIcon';
import styles from './Controls.module.scss';

type ControlsProps = {
    backLink?: {
        href: string;
        label: string;
    };
    filter?: {
        value: string;
        options: string[];
        maxLabel: string;
        onChange: (value: string) => void;
    };
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
    filter,
    search,
    add,
    pagination,
    children,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const ALL_OPTION: string = 'All';

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        search?.onChange(e.target.value);
    };

    const handleFilterChange = (value: string): void => {
        filter?.onChange(value === ALL_OPTION ? '' : value);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const hasLeading = Boolean(backLink) || Boolean(filter) || Boolean(add);
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
                    {filter ? (
                        <div className={styles.left}>
                            <Dropdown
                                value={
                                    filter.value === ''
                                        ? ALL_OPTION
                                        : filter.value
                                }
                                onChange={handleFilterChange}
                                options={[ALL_OPTION, ...filter.options]}
                                icon={<FilterIcon />}
                                maxLabel={filter.maxLabel}
                                variant="control"
                            />
                        </div>
                    ) : null}
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
