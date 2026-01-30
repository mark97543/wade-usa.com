// /root/projects/wade-template/src/context/GlobalContext.tsx

/**
 * 🧠 GLOBAL CONTEXT
 * ---------------------------------------------------------------------
 * Purpose: A central store for shared application data to prevent prop-drilling.
 * Responsibilities:
 * 1. Managing Page Titles (Browser Tab).
 * 2. Handling System Notifications (Toasts/Alerts).
 * 3. Storing "Global Variables" like Active Project ID or Page Configs.
 * ---------------------------------------------------------------------
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of your Global State
interface GlobalState {
  pageTitle: string;
  notifications: string[]; // A list of messages (Success, Error, etc.)
  activeProjectId: string | null; // Example of a shared ID
}

interface GlobalContextType {
  state: GlobalState;
  setPageTitle: (title: string) => void;
  addNotification: (msg: string) => void;
  setActiveProject: (id: string) => void;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GlobalState>({
    pageTitle: 'Dashboard',
    notifications: [],
    activeProjectId: null
  });

  // Action: Update Title
  const setPageTitle = (title: string) => {
    setState(prev => ({ ...prev, pageTitle: title }));
    document.title = `${title} | Wade App`; 
  };

  // Action: Add Alert/Notification
  const addNotification = (msg: string) => {
    setState(prev => ({ ...prev, notifications: [...prev.notifications, msg] }));
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n !== msg)
      }));
    }, 3000);
  };

  // Action: Set Active Project
  const setActiveProject = (id: string) => {
    setState(prev => ({ ...prev, activeProjectId: id }));
  };

  return (
    <GlobalContext.Provider value={{ state, setPageTitle, addNotification, setActiveProject }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);