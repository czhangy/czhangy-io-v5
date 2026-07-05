import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import GamesContent from './GamesContent/GamesContent';
import styles from './GamesPage.module.scss';

const GamesPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.games.findMany({
        orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });
    const games: Game[] = records.map((g) => ({
        name: g.name,
        genre: g.genre,
        icon: g.icon,
        rating: g.rating,
    }));

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
