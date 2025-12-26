import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';

// ----------------------------------------------------------------------
// 1. CONFIGURATION
// ----------------------------------------------------------------------

interface StatesState {
  isSidebarCollapsed: boolean;
  selectedView: string;
}

interface StatesActions {
  toggleSidebar: () => void;
  toggleView: (view: string) => void;
}

type StatesContextType = StatesState & StatesActions;

const initialState: StatesState = {
  isSidebarCollapsed: false,
  selectedView: 'dashboard'
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

  const toggleView = (view: string) => {
    setState((prev) => ({ 
        ...prev, 
        selectedView: view 
    }));
  };


  return (
    <StatesContext.Provider 
      value={{ 
        ...state,      // Correctly spreads isSidebarCollapsed
        toggleSidebar, //Sidebar Toggle. 
        toggleView    //View Toggle.
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