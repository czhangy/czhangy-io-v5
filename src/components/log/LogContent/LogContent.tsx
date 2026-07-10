'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminActions from '@/components/common/AdminActions/AdminActions';
import { useSession } from '@/lib/context/SessionContext';
import { Log } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import styles from './LogContent.module.scss';

type LogContentProps = {
    entry: Log;
};

const LogContent: React.FC<LogContentProps> = ({ entry }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();
    const router = useRouter();

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleDelete = async (): Promise<void> => {
        const res = await fetch(`/api/logs/${entry.id}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        router.push('/logs');
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['log-content']}>
            <Link href="/logs" className={styles.back}>
                ← Back
            </Link>
            <div className={styles.top}>
                <div className={styles.header}>
                    <div className={styles.heading}>
                        <h2 className={styles['entry-title']}>{entry.title}</h2>
                        <span className={styles.date}>
                            {DateHelpers.getHumanReadableDate(entry.createdAt)}
                        </span>
                    </div>
                    {isAdmin ? (
                        <AdminActions
                            entryName={entry.title}
                            onDelete={handleDelete}
                        />
                    ) : null}
                </div>
                {entry.tags.length > 0 ? (
                    <div className={styles.tags}>
                        {entry.tags.map((tag) => (
                            <span key={tag} className={styles['tag-pill']}>
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
            <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: entry.body }}
            />
        </div>
    );
};

export default LogContent;
