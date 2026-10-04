'use client';

import { useState } from 'react';
import Controls from '@/components/common/Controls/Controls';
import { useSession } from '@/lib/context/SessionContext';
import { PROJECT_STATUSES } from '@/lib/static/constants';
import { Project } from '@/lib/static/types';
import ProjectHelpers from '@/lib/utils/ProjectHelpers';
import AddProjectModal from './AddProjectModal/AddProjectModal';
import EditProjectModal from './EditProjectModal/EditProjectModal';
import ProjectCard from './ProjectCard/ProjectCard';
import styles from './ProjectsContent.module.scss';

type ProjectsContentProps = {
    projects: Project[];
};

const ProjectsContent: React.FC<ProjectsContentProps> = ({
    projects: initialProjects,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (project: Project): void => {
        setProjects((prev) => [...prev, project]);
    };

    const handleUpdate = (updated: Project): void => {
        setProjects((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingProject(null);
    };

    const handleDelete = async (id: number): Promise<void> => {
        const success = await ProjectHelpers.delete(id);
        if (!success) return;
        setProjects((prev) => prev.filter((p) => p.id !== id));
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const getStatusRank = (project: Project): number => {
        const index = PROJECT_STATUSES.indexOf(project.status);
        return index === -1 ? PROJECT_STATUSES.length : index;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const sortedProjects: Project[] = [...projects].sort(
        (a, b) =>
            getStatusRank(a) - getStatusRank(b) || a.name.localeCompare(b.name)
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['projects-content']}>
            <Controls
                add={{
                    label: 'Add Project',
                    isAdmin,
                    onClick: () => setIsAddOpen(true),
                }}
            >
                {isAddOpen ? (
                    <AddProjectModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAdd}
                    />
                ) : null}
            </Controls>
            <div className={styles.grid}>
                {sortedProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        isAdmin={isAdmin}
                        onEdit={() => setEditingProject(project)}
                        onDelete={() => handleDelete(project.id)}
                    />
                ))}
            </div>
            {editingProject ? (
                <EditProjectModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onEdit={handleUpdate}
                />
            ) : null}
        </div>
    );
};

export default ProjectsContent;
