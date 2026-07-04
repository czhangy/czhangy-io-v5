import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import GamesContent from './GamesContent/GamesContent';
import styles from './GamesPage.module.scss';

const GamesPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const games: Game[] = await prisma.game.findMany({
        orderBy: [{ rating: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }],
    });

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['games-page']}>
            <div className={styles.content}>
                <GlitchText text="GAMES" className={styles.title} />
                <GamesContent initialGames={games} />
            </div>
        </div>
    );
};

export default GamesPage;
