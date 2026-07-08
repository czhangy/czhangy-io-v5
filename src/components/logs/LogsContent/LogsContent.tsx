'use client';

import { useRouter } from 'next/navigation';
import Controls from '@/components/common/Controls/Controls';
import { useSession } from '@/lib/context/SessionContext';
import styles from './LogsContent.module.scss';

const LogsContent: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();
    const router = useRouter();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['logs-content']}>
            <Controls
                add={{
                    label: 'Add Log',
                    isAdmin: role === 'ADMIN',
                    onClick: () => router.push('/logs/new'),
                }}
            />
        </div>
    );
};

export default LogsContent;
