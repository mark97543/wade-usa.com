export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  avatar?: string;
}

// THIS is the part that is likely missing or not exported
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => Promise<void>;
  // Role Helpers
  hasRole: (roleId: string) => boolean;
  isAdmin: boolean;
}