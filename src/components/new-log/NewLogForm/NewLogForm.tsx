'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import LinkIcon from '@/lib/icons/LinkIcon';
import ListIcon from '@/lib/icons/ListIcon';
import QuoteIcon from '@/lib/icons/QuoteIcon';
import LinkModal from './LinkModal/LinkModal';
import styles from './NewLogForm.module.scss';

const NewLogForm: React.FC = () => {
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

    const [title, setTitle] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();

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

    const handlePublish = async (): Promise<void> => {
        setIsPublishing(true);
        const tagList = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        const res = await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, tags: tagList, body }),
        });
        if (!res.ok) {
            console.error('Failed to publish log', await res.json());
            setIsPublishing(false);
            return;
        }
        router.push('/logs');
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
        title.trim().length > 0 && !editorState.isEmpty && !isPublishing;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['new-log-form']}>
            <FormField
                label="Title"
                value={title}
                onChange={setTitle}
                autoFocus
            />
            <FormField label="Tags" value={tags} onChange={setTags} />
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
            <AddButton
                label="Publish"
                disabled={!isValid}
                onSubmit={handlePublish}
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

export default NewLogForm;
