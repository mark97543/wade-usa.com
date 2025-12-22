// services/main/src/types/user.ts
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Directus can return role as ID string OR Object depending on query depth
  role: {
    id: string;
    name: string;
  } | string; 
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleId: string) => boolean;
  isAdmin: boolean;
}