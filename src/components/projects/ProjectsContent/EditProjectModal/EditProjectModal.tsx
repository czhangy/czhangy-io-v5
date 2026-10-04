'use client';

import Modal from '@/components/common/Modal/Modal';
import ProjectForm from '@/components/projects/ProjectsContent/ProjectForm/ProjectForm';
import { CreateProjectParams, Project } from '@/lib/static/types';
import ProjectHelpers from '@/lib/utils/ProjectHelpers';

type EditProjectModalProps = {
    project: Project;
    onClose: () => void;
    onEdit: (project: Project) => void;
};

const EditProjectModal: React.FC<EditProjectModalProps> = ({
    project,
    onClose,
    onEdit,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateProjectParams): Promise<void> => {
        const updated = await ProjectHelpers.update(project.id, values);
        onEdit(updated);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT PROJECT" onClose={onClose}>
            <ProjectForm
                submitLabel="Save"
                initialValues={{
                    name: project.name,
                    description: project.description,
                    icon: project.icon,
                    status: project.status,
                    url: project.url,
                }}
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default EditProjectModal;
