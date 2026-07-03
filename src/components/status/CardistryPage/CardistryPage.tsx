import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import CardistryContent from './CardistryContent/CardistryContent';
import styles from './CardistryPage.module.scss';

const CardistryPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const moves: CardistryMoveEntry[] = await prisma.cardistryMove.findMany({
        orderBy: { name: 'asc' },
    });

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
