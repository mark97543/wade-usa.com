// services/main/src/components/molecules/Dropdown/Dropdown.tsx

import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export const Dropdown = ({ trigger, children, align = 'left' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle visibility on click
  const handleToggle = () => setIsOpen((prev) => !prev);

  // Close the menu if a click occurs outside of the dropdown container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Wrap trigger in a div to capture the click without modifying the trigger component itself */}
      <div className={styles.triggerWrapper} onClick={handleToggle}>
        {trigger}
      </div>
      
      <div 
        className={`
          ${styles.menu} 
          ${isOpen ? styles.open : ''} 
          ${align === 'right' ? styles.alignRight : ''} 
        `}
        // Close menu when an item inside is clicked
        onClick={() => setIsOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, style }: { children: ReactNode, onClick?: () => void, style?: React.CSSProperties }) => (
  <div className={styles.item} onClick={onClick} style={style}>
    {children}
  </div>
);