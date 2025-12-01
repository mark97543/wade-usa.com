// src/components/organisms/Header/types.ts

// 1. Export NavItem
export interface NavItem {
  label: string;
  path?: string;
  type?: 'link' | 'dropdown' | 'action';
  children?: NavItem[];
  requiresAdmin?: boolean;
}

// 2. Export UserProfile
export interface UserProfile {
  name: string;
  email: string;
  isAdmin?: boolean;
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