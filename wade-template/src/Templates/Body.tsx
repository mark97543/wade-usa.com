/**
 * 📄 TEMPLATE: Body
 * ---------------------------------------------------------------------
 * A reusable layout wrapper for standard pages.
 * * @description
 * This component acts as the "Frame" for your page content. It automatically:
 * 1. Pushes content down (margin-top) to clear the fixed Navbar/Header.
 * 2. Centers content horizontally with safe max-widths.
 * 3. Applies standard padding and global theme background colors.
 * * @example
 * <Body>
 * <h1>My Page Title</h1>
 * <p>Page content goes here...</p>
 * </Body>
 * ---------------------------------------------------------------------
 */


import type { ReactNode } from 'react';
import { LAYOUT } from '../config/layout';

interface BodyProps {
  children: ReactNode;
  className?: string; // Optional: in case you want to add extra styles later
}

export default function Body({ children, className = '' }: BodyProps) {
  
  return (
    <div 
      className={className}
      style={{
        // 1. PUSH DOWN: Clear the fixed header
        marginTop: LAYOUT.HEADER_HEIGHT,

        // 2. SIDE MARGINS: Keep content centered and readable
        // We use 'auto' margins + max-width to create the "side gutters"
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: LAYOUT.CONTENT_MAX_WIDTH, // Stops content from getting too wide on huge screens
        
        // 3. INNER PADDING: Breathing room inside the container
        padding: '20px', 
        
        // 4. FULL HEIGHT: Ensure it takes up the rest of the screen
        minHeight: `calc(100vh - ${LAYOUT.HEADER_HEIGHT})`,
        
        // 5. COLORS: Inherit from your Theme Context
        backgroundColor: 'var(--c-bg)',
        color: 'var(--c-text)',
        
        // Smooth transition if you resize window or toggle themes
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </div>
  );
}