/**
 * 🗄️ STATE CONTEXT (The Variable Bucket)
 * ---------------------------------------------------------------------
 * Purpose: A generic store for application variables to prevent prop-drilling.
 * Features:
 * 1. Holds any type of data (Strings, Numbers, Arrays, Objects).
 * 2. Instantly updates all components watching a specific variable.
 * ---------------------------------------------------------------------
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of our bucket (Key-Value pairs)
type StateBucket = Record<string, any>;

interface StateContextType {
  data: StateBucket;
  setVariable: (key: string, value: any) => void;
  // We expose a clearData function just in case you need to reset (e.g., on logout)
  clearData: () => void;
}

const StateContext = createContext<StateContextType>({} as StateContextType);

export function StateProvider({ children }: { children: ReactNode }) {
  // The "Bucket"
  const [data, setData] = useState<StateBucket>({
    // You can set global defaults here if you want
    // e.g., current_project_id: null,
  });

  // Action: Write to the bucket
  const setVariable = (key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Action: Reset the bucket
  const clearData = () => {
    setData({});
  };

  return (
    <StateContext.Provider value={{ data, setVariable, clearData }}>
      {children}
    </StateContext.Provider>
  );
}

// Hook for easy access
export const useStateStore = () => useContext(StateContext);

/*
  ===========================================================================
  🚀 QUICK & DIRTY USAGE GUIDE
  ===========================================================================

  1. IMPORT THE HOOK
     import { useStateStore } from './StateContext';

  ---------------------------------------------------------------------------

  2. SCENARIO A: SETTING DATA (e.g., Inside a Form or Modal)
  
     const { setVariable } = useStateStore();

     // Store a simple value
     setVariable('current_budget', 5000);

     // Store a complex object
     setVariable('active_user_settings', { theme: 'dark', notifications: true });

  ---------------------------------------------------------------------------

  3. SCENARIO B: READING DATA (e.g., Inside a Header or Dashboard)

     const { data } = useStateStore();

     // Read it back (always handle the case where it might be undefined/null)
     const budget = data['current_budget'] || 0;
     const settings = data['active_user_settings'] || {};

     return <div>Budget: ${budget}</div>;

  ===========================================================================
*/