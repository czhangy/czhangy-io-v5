'use client';

import AdminActions from '@/components/common/AdminActions/AdminActions';
import PageLinkIcon from '@/lib/icons/PageLinkIcon';
import { Project } from '@/lib/static/types';
import styles from './ProjectCard.module.scss';

type ProjectCardProps = {
    project: Project;
    isAdmin: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    isAdmin,
    onEdit,
    onDelete,
}) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const statusClass: string =
        project.status === 'Live'
            ? styles['project-card__status--live']
            : project.status === 'In Development'
              ? styles['project-card__status--development']
              : '';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['project-card']}>
            <div className={styles.header}>
                <div className={styles['icon-wrapper']}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={project.icon}
                        alt={`${project.name} icon`}
                        width={48}
                        height={48}
                        className={styles.icon}
                    />
                </div>
                <div className={styles.heading}>
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.name}
                    >
                        {project.name}
                    </a>
                    <span
                        className={`${styles['project-card__status']} ${statusClass}`}
                    >
                        <span className={styles.dot} />
                        {project.status}
                    </span>
                </div>
            </div>
            <p className={styles.description}>{project.description}</p>
            <div className={styles.footer}>
                <span className={styles.visit}>
                    Visit
                    <PageLinkIcon />
                </span>
                {isAdmin ? (
                    <AdminActions
                        className={styles.actions}
                        entryName={project.name}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default ProjectCard;
