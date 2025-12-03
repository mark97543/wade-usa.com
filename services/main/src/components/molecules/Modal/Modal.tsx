// services/main/src/components/molecules/Modal/Modal.tsx

import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * An accessible, theme-aware modal dialog component.
 * Handles backdrop clicks and Escape key presses.
 */
export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Effect for closing on Escape key press and managing body scroll
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Manage body scrolling (prevents background content from scrolling)
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus the modal content for better accessibility (optional, depends on content)
      if (modalRef.current) {
        modalRef.current.focus(); 
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Ensure scrolling is restored if component unmounts while open
      if (!isOpen) { 
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose]);


  // If not open, don't render anything
  if (!isOpen) {
    return null;
  }
  
  // Handle click on the backdrop (outer area)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click occurred on the backdrop itself, not the modal content
    if (event.target === event.currentTarget) {
      onClose();
    }
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
        tabIndex={-1} // Makes the modal container focusable
      >
        <div className={styles.header}>
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
        {children}
      </div>
    </div>
  );
};