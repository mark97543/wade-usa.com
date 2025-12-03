// services/main/src/components/molecules/Accordion/Accordion.tsx

import React, { useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}

/**
 * A theme-aware, collapsible panel component.
 */
export const Accordion = ({ title, children, isOpenDefault = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.header} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
        type="button"
      >
        <span>{title}</span>
        <span className={styles.icon}>{isOpen ? '▲' : '▼'}</span>
      </button>

      <div 
        id="accordion-content"
        className={`${styles.contentWrapper} ${isOpen ? styles.open : ''}`}
      >
        {/* Inner div prevents content from stretching during grid transition */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};