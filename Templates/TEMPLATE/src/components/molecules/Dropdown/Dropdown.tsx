import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dropdown.module.css';

interface DropdownProps {
  trigger: React.ReactNode; 
  children: React.ReactNode; 
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<React.CSSProperties>({});
  
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Function to calculate position before opening
  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const screenWidth = document.documentElement.clientWidth;
      const screenHeight = document.documentElement.clientHeight;

      // 1. Calculate placement (Align Right edge of menu to Right edge of trigger)
      const rightSpace = screenWidth - rect.right;
      
      // 2. Smart Flip (Check if enough space below, otherwise flip up)
      const spaceBelow = screenHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuHeightApprox = 200; // Estimate or measure if needed

      let topPosition: number;
      let bottomPosition: number | undefined;
      
      if (spaceBelow < menuHeightApprox && spaceAbove > spaceBelow) {
        // Not enough space below, put it ABOVE
        topPosition = -9999; // Unused
        bottomPosition = screenHeight - rect.top;
      } else {
        // Put it BELOW
        topPosition = rect.bottom + 5; // +5px gap
        bottomPosition = undefined;
      }

      setPosition({
        position: 'fixed',
        right: `${rightSpace}px`,
        top: bottomPosition ? 'auto' : `${topPosition}px`,
        bottom: bottomPosition ? `${bottomPosition}px` : 'auto',
        minWidth: '200px',
        zIndex: 9999, // Ensure it's on top of everything
      });
    }
    setIsOpen(!isOpen);
  };

  // Close when clicking outside OR Scrolling (to prevent detached menus)
  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = () => setIsOpen(false);

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('scroll', closeMenu, true); // true = capture scroll in any container
    window.addEventListener('resize', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        ref={triggerRef}
        className={styles.trigger} 
        onClick={(e) => {
          e.stopPropagation(); // Prevent immediate closing
          handleOpen();
        }}
        type="button"
      >
        {trigger}
      </button>

      {/* Render the Menu directly into the Body (Portal) */}
      {isOpen && createPortal(
        <div 
          className={`${styles.menu} ${styles.open}`}
          style={position}
          onClick={() => setIsOpen(false)} // Close on item click
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
};

// Helper component (Unchanged)
export const DropdownItem = ({ children, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={styles.item} onClick={onClick} {...props}>
      {children}
    </button>
  );
};