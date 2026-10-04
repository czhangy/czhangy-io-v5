import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Project } from '@/lib/static/types';
import ProjectsContent from './ProjectsContent/ProjectsContent';
import styles from './ProjectsPage.module.scss';

const ProjectsPage = async () => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.projects.findMany();

    const projects: Project[] = records.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        icon: r.icon,
        status: r.status,
        url: r.url,
    }));

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['projects-page']}>
            <div className={styles.content}>
                <GlitchText text="PROJECTS" className={styles.title} />
                <ProjectsContent projects={projects} />
            </div>
        </div>
    );
};

export default ProjectsPage;
