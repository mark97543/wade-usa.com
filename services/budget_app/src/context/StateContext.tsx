import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';

// ----------------------------------------------------------------------
// 1. CONFIGURATION
// ----------------------------------------------------------------------

interface StatesState {
  isSidebarCollapsed: boolean;
}

interface StatesActions {
  toggleSidebar: () => void;
}

type StatesContextType = StatesState & StatesActions;

const initialState: StatesState = {
  isSidebarCollapsed: false,
};

// ----------------------------------------------------------------------
// 2. SETUP
// ----------------------------------------------------------------------
const StatesContext = createContext<StatesContextType | undefined>(undefined);

export const StatesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StatesState>(initialState);

  // --- ACTIONS ---
  const toggleSidebar = () => {
    setState((prev) => ({ 
        ...prev, 
        isSidebarCollapsed: !prev.isSidebarCollapsed 
    }));
  };

  return (
    <StatesContext.Provider 
      value={{ 
        ...state,      // Correctly spreads isSidebarCollapsed
        toggleSidebar //Sidebar Toggle. 
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};

// ----------------------------------------------------------------------
// 3. CONSUMER HOOK
// ----------------------------------------------------------------------
export const useStatess = () => {
  const context = useContext(StatesContext);
  if (!context) {
    // Note: Updated error message to be specific to this provider
    throw new Error('useStates must be used within a StatesProvider');
  }
  return context;
};