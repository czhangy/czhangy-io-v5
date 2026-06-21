import type { Metadata } from 'next';
import AchievementsPage from '@/components/achievements/AchievementsPage';

export const metadata: Metadata = { title: 'Achievements' };

export default function Achievements() {
    return <AchievementsPage />;
}
