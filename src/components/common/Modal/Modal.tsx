'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MediaHelpers from '@/lib/utils/MediaHelpers';
import styles from './Modal.module.scss';

type ModalProps = {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isClosing, setIsClosing] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const scrollY = window.scrollY;
        const { overflow, position, top, width } = document.body.style;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = overflow;
            document.body.style.position = position;
            document.body.style.top = top;
            document.body.style.width = width;
            window.scrollTo(0, scrollY);
        };
    }, []);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleStartClose = (): void => {
        if (MediaHelpers.prefersReducedMotion()) {
            onClose();
        } else {
            setIsClosing(true);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) handleStartClose();
    };

    const handleAnimationEnd = (
        e: React.AnimationEvent<HTMLDivElement>
    ): void => {
        if (isClosing && e.target === e.currentTarget) onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return createPortal(
        <div
            className={`${styles.overlay} ${isClosing ? `${styles['overlay--closing']}` : ''}`}
            onClick={handleOverlayClick}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span className={styles.title}>{title}</span>
                    <button
                        className={styles['close-button']}
                        type="button"
                        onClick={handleStartClose}
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
