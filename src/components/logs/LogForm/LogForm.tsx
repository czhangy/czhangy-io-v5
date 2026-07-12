'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import LinkIcon from '@/lib/icons/LinkIcon';
import ListIcon from '@/lib/icons/ListIcon';
import QuoteIcon from '@/lib/icons/QuoteIcon';
import { CreateLogParams } from '@/lib/static/types';
import LinkModal from './LinkModal/LinkModal';
import styles from './LogForm.module.scss';
import TagsField from './TagsField/TagsField';

type LogFormProps = {
    submitLabel: string;
    initialValues?: Partial<CreateLogParams>;
    onSubmit: (values: CreateLogParams) => Promise<void>;
    onChange?: (values: CreateLogParams) => void;
};

const LogForm: React.FC<LogFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
    onChange,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_EDITOR_STATE = {
        isEmpty: true,
        bold: false,
        italic: false,
        underline: false,
        heading1: false,
        heading2: false,
        heading3: false,
        bulletList: false,
        blockquote: false,
        link: false,
    };

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [title, setTitle] = useState<string>(initialValues?.title ?? '');
    const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
    const [body, setBody] = useState<string>(initialValues?.body ?? '');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const editor = useEditor(
        {
            extensions: [
                StarterKit.configure({
                    code: false,
                    codeBlock: false,
                    horizontalRule: false,
                    strike: false,
                    orderedList: false,
                    heading: { levels: [1, 2, 3] },
                    link: { openOnClick: false, autolink: false },
                }),
            ],
            content: initialValues?.body ?? '',
            immediatelyRender: false,
            editorProps: {
                attributes: { class: styles.editor },
            },
            onUpdate: ({ editor }) => {
                setBody(editor.getHTML());
            },
        },
        []
    );

    const rawEditorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isEmpty: editor?.isEmpty ?? true,
            bold: editor?.isActive('bold') ?? false,
            italic: editor?.isActive('italic') ?? false,
            underline: editor?.isActive('underline') ?? false,
            heading1: editor?.isActive('heading', { level: 1 }) ?? false,
            heading2: editor?.isActive('heading', { level: 2 }) ?? false,
            heading3: editor?.isActive('heading', { level: 3 }) ?? false,
            bulletList: editor?.isActive('bulletList') ?? false,
            blockquote: editor?.isActive('blockquote') ?? false,
            link: editor?.isActive('link') ?? false,
        }),
    });

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        onChange?.({ title, tags, body });
    }, [title, tags, body, onChange]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleToggleLink = (): void => {
        if (!editor) return;
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        setIsLinkModalOpen(true);
    };

    const handleConfirmLink = (url: string): void => {
        editor?.chain().focus().setLink({ href: url }).run();
        setIsLinkModalOpen(false);
    };

    const handleCancelLink = (): void => {
        setIsLinkModalOpen(false);
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);
        setError('');
        try {
            await onSubmit({ title: title.trim(), tags, body });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsSubmitting(false);
        }
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const toolbarButtonClass = (active: boolean): string => {
        const activeClass = active ? styles['toolbar-button--active'] : '';
        return `${styles['toolbar-button']} ${activeClass}`;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const editorState = rawEditorState ?? DEFAULT_EDITOR_STATE;

    const isValid: boolean =
        title.trim().length > 0 && !editorState.isEmpty && !isSubmitting;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['log-form']}>
            <FormField
                label="Title"
                value={title}
                onChange={setTitle}
                autoFocus
            />
            <TagsField label="Tags" tags={tags} onChange={setTags} />
            <div className={styles['body-field']}>
                <span className={styles.label}>Body</span>
                <div className={styles.toolbar}>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.bold)}
                        disabled={!editor}
                        onClick={() =>
                            editor?.chain().focus().toggleBold().run()
                        }
                    >
                        <span className={styles.bold}>B</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.italic)}
                        disabled={!editor}
                        onClick={() =>
                            editor?.chain().focus().toggleItalic().run()
                        }
                    >
                        <span className={styles.italic}>I</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.underline)}
                        disabled={!editor}
                        onClick={() =>
                            editor?.chain().focus().toggleUnderline().run()
                        }
                    >
                        <span className={styles.underline}>U</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.heading1)}
                        disabled={!editor}
                        onClick={() =>
                            editor
                                ?.chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                        }
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.heading2)}
                        disabled={!editor}
                        onClick={() =>
                            editor
                                ?.chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.heading3)}
                        disabled={!editor}
                        onClick={() =>
                            editor
                                ?.chain()
                                .focus()
                                .toggleHeading({ level: 3 })
                                .run()
                        }
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.bulletList)}
                        disabled={!editor}
                        onClick={() =>
                            editor?.chain().focus().toggleBulletList().run()
                        }
                    >
                        <ListIcon />
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.blockquote)}
                        disabled={!editor}
                        onClick={() =>
                            editor?.chain().focus().toggleBlockquote().run()
                        }
                    >
                        <QuoteIcon />
                    </button>
                    <button
                        type="button"
                        className={toolbarButtonClass(editorState.link)}
                        disabled={!editor}
                        onClick={handleToggleLink}
                    >
                        <LinkIcon />
                    </button>
                </div>
                <EditorContent editor={editor} />
            </div>
            {error ? <span className={styles.error}>{error}</span> : null}
            <AddButton
                label={isSubmitting ? 'Saving...' : submitLabel}
                disabled={!isValid}
                onSubmit={handleSubmit}
            />
            {isLinkModalOpen ? (
                <LinkModal
                    onConfirm={handleConfirmLink}
                    onCancel={handleCancelLink}
                />
            ) : null}
        </div>
    );
};

export default LogForm;
