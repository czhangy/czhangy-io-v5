import { notFound } from 'next/navigation';
import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Log } from '@/lib/static/types';
import EditLogForm from './EditLogForm/EditLogForm';
import styles from './EditLogPage.module.scss';

type EditLogPageProps = {
    slug: string;
};

const EditLogPage = async ({ slug }: EditLogPageProps) => {
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
        <div className={styles['edit-log-page']}>
            <div className={styles.content}>
                <GlitchText text="EDIT LOG" className={styles.title} />
                <EditLogForm entry={entry} />
            </div>
        </div>
    );
};

export default EditLogPage;
