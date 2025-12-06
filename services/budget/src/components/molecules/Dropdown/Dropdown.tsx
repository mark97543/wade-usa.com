import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dropdown.module.css';

interface DropdownProps {
  trigger: React.ReactNode; 
  children: React.ReactNode; 
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // We need distinct refs for the button (in the table) and the menu (in the body)
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Store coordinates for the floating menu
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // 1. Calculate Position when opening
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      // Basic positioning: Align bottom-left of trigger
      // Note: You might want to adjust 'left' if you want right alignment (rect.right - 200)
      setCoords({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // 2. Handle "Click Outside" (Updated for Portal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // We must check BOTH the trigger and the menu since they are now in different places in the DOM
      const clickedTrigger = triggerRef.current && triggerRef.current.contains(event.target as Node);
      const clickedMenu = menuRef.current && menuRef.current.contains(event.target as Node);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    // Close on Scroll/Resize (Prevents menu from floating detached when you scroll the table)
    const handleScroll = () => { if(isOpen) setIsOpen(false); };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // true = capture phase (detects table scroll)
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  // 3. Render the Menu into document.body using a Portal
  const menuContent = isOpen ? (
    <div 
      ref={menuRef}
      className={`${styles.menu} ${styles.open}`}
      style={{
        position: 'fixed', // Fixed to viewport
        top: coords.top - window.scrollY, // Adjust for viewport relative
        left: coords.left - window.scrollX,
        zIndex: 9999, // Ensure it's on top of everything
        minWidth: '200px', // Prevent squishing
        // width: coords.width // Optional: Match trigger width?
      }}
      onClick={() => setIsOpen(false)} // Close when an item is clicked
    >
      {children}
    </div>
  ) : null;

  return (
    <>
      <button 
        ref={triggerRef}
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {trigger}
      </button>

      {/* Magic: Teleport this div to <body> */}
      {createPortal(menuContent, document.body)}
    </>
  );
};

export const DropdownItem = ({ children, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={styles.item} onClick={onClick} {...props}>
      {children}
    </button>
  );
};