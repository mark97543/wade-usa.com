/**
 * Generic Modal Component
 * * Logic:
 * 1. Uses a backdrop with blur to focus user attention.
 * 2. Handles Escape key and backdrop clicks for closing.
 * 3. Manages body scroll lock when open.
 * 4. Utilizes React Portals (optional) or standard conditional rendering.
 * * Theme:
 * - Automatically pulls from global CSS variables (--c-bg, --c-text, etc.)
 */

import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      
      if (modalRef.current) {
        modalRef.current.focus(); 
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div 
      className={`${styles.backdrop} ${isOpen ? styles.open : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={styles.modalContainer}
        tabIndex={-1} 
      >
        <div className={styles.modal_header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="Close modal"
            type="button"
          >
            &times;
          </button>
        </div>
        <div className={styles.modal_content}>
          {children}
        </div>
      </div>
    </div>
  );
};