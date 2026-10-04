import type { Metadata } from 'next';
import ProjectsPage from '@/components/projects/ProjectsPage';

export const metadata: Metadata = { title: 'Projects' };

export default function Projects() {
    return <ProjectsPage />;
}
