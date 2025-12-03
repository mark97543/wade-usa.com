import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  trigger: React.ReactNode; // What you click to open (e.g., "Menu" text or an Icon)
  children: React.ReactNode; // The list of items inside
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {trigger}
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        {children}
      </div>
    </div>
  );
};

// Helper component for items
export const DropdownItem = ({ children, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={styles.item} onClick={onClick} {...props}>
      {children}
    </button>
  );
};