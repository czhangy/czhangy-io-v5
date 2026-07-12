import GlitchText from '@/components/common/GlitchText/GlitchText';
import { LOG_DRAFT_ID } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CreateLogParams } from '@/lib/static/types';
import NewLogForm from './NewLogForm/NewLogForm';
import styles from './NewLogPage.module.scss';

const NewLogPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const draft = await prisma.logDraft.findUnique({
        where: { id: LOG_DRAFT_ID },
    });

    const initialValues: Partial<CreateLogParams> | undefined = draft
        ? { title: draft.title, tags: draft.tags, body: draft.body }
        : undefined;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['new-log-page']}>
            <div className={styles.content}>
                <GlitchText text="NEW LOG" className={styles.title} />
                <NewLogForm initialValues={initialValues} />
            </div>
        </div>
    );
};

export default NewLogPage;
