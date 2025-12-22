// src/components/organisms/Header/types.ts

// 1. Export NavItem
export interface NavItem {
  label: string;
  path?: string;
  type?: 'link' | 'dropdown' | 'action';
  
  // ✅ FIX: Added the 'allowedRoles' property used by App.tsx filtering logic
  allowedRoles?: string[]; 
  
  children?: NavItem[];
  // NOTE: 'requiresAdmin' property has been removed as it is replaced by allowedRoles
}

// 2. Export UserProfile
export interface UserProfile {
  name: string;
  email: string;
  isAdmin?: boolean;
  // This is used for crash-proofing the role check in Header.tsx
  roleId: string | null; 
}

// 3. THIS IS THE MISSING PART: Ensure 'export' is here
export interface HeaderProps {
  logoUrl?: string;
  siteName: string;
  mainNav: NavItem[];
  user?: UserProfile | null;
  onLogin?: () => void;
  onLogout?: () => void;
}