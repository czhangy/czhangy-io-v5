'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import { WatchedMediaEntry } from '@/lib/static/types';
import styles from './WatchedContent.module.scss';

type WatchedContentProps = {
    initialEntries: WatchedMediaEntry[];
};

const WatchedContent: React.FC<WatchedContentProps> = ({ initialEntries }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<WatchedMediaEntry[]>(initialEntries);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleDelete = async (id: number) => {
        const res = await fetch(`/api/watched/${id}`, { method: 'DELETE' });
        if (!res.ok) return;
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <ul className={styles.list}>
            {entries.map((entry) => (
                <li key={entry.id} className={styles.item}>
                    {entry.poster ? (
                        <Image
                            className={styles.poster}
                            src={entry.poster}
                            alt={`${entry.name} poster`}
                            width={43}
                            height={60}
                        />
                    ) : (
                        <div className={styles['poster-placeholder']} />
                    )}
                    <div className={styles.info}>
                        <span className={styles.name}>{entry.name}</span>
                        {entry.genres.length > 0 ? (
                            <div className={styles.genres}>
                                {entry.genres.slice(0, 2).map((g) => (
                                    <span
                                        key={g}
                                        className={styles['genre-tag']}
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    {isAdmin ? (
                        <button
                            type="button"
                            className={styles['delete-button']}
                            onClick={() => handleDelete(entry.id)}
                        >
                            <DeleteIcon />
                        </button>
                    ) : null}
                </li>
            ))}
        </ul>
    );
};

export default WatchedContent;
