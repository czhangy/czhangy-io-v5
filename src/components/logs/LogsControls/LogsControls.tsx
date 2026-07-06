'use client';

import Link from 'next/link';
import { useSession } from '@/lib/context/SessionContext';
import styles from './LogsControls.module.scss';

const LogsControls: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['logs-controls']}>
            {role === 'ADMIN' ? (
                <Link href="/logs/new" className={styles['add-button']}>
                    Add Log
                </Link>
            ) : null}
        </div>
    );
};

export default LogsControls;
