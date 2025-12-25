// services/main/src/components/molecules/Dropdown/Dropdown.tsx

import { useState, useRef, useEffect} from 'react';
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

  return (
    <div 
      className={styles.container} 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      
      <div 
        className={`
          ${styles.menu} 
          ${isOpen ? styles.open : ''} 
          ${align === 'right' ? styles.alignRight : ''} 
        `}
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