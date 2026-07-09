import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Log } from '@/lib/static/types';
import LogsContent from './LogsContent/LogsContent';
import styles from './LogsPage.module.scss';

const LogsPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.logs.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const entries: Log[] = records.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        tags: r.tags,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }));

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['logs-page']}>
            <div className={styles.content}>
                <GlitchText text="LOGS" className={styles.title} />
                <LogsContent initialEntries={entries} />
            </div>
        </div>
    );
};

export default LogsPage;
