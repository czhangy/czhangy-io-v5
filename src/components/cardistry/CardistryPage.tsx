import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Move } from '@/lib/static/types';
import CardistryContent from './CardistryContent/CardistryContent';
import styles from './CardistryPage.module.scss';

const CardistryPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.moves.findMany({
        orderBy: { createdAt: 'asc' },
    });

    const moves: Move[] = records.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
    }));

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['cardistry-page']}>
            <div className={styles.content}>
                <GlitchText text="CARDISTRY" className={styles.title} />
                <CardistryContent initialMoves={moves} />
            </div>
        </div>
    );
};

export default CardistryPage;
