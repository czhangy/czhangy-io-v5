import { notFound } from 'next/navigation';
import { prisma } from '@/lib/static/prisma';
import { Log } from '@/lib/static/types';
import LogContent from './LogContent/LogContent';
import styles from './LogPage.module.scss';

type LogPageProps = {
    slug: string;
};

const LogPage = async ({ slug }: LogPageProps) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const record = await prisma.logs.findUnique({ where: { slug } });

    if (!record) notFound();

    const entry: Log = {
        id: record.id,
        slug: record.slug,
        title: record.title,
        tags: record.tags,
        body: record.body,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['log-page']}>
            <div className={styles.content}>
                <LogContent entry={entry} />
            </div>
        </div>
    );
};

export default LogPage;
