# Context Documentation (`src/context/`)

**Purpose:** This directory holds the **State Management** logic for your application. If you have data that needs to be accessed by many different components (like "User is logged in" or "Current Theme"), it belongs here.

## 📂 The Two Types of Context

In the Wade-USA architecture, we distinguish between two types of context based on **where** they are implemented.

### 1\. Global Context (The "Life Support")

These are critical for the app to function. They wrap the entire application in `main.tsx`.

- **Examples:** `AuthContext` (User Session), `ThemeContext` (Colors), `ToastContext` (Notifications).
    
- **Scope:** Available everywhere, 24/7.
    

### 2\. Feature Scoped Context (The "Workspaces")

These are specific to a complex feature. They wrap only specific routes in `App.tsx`.

- **Examples:** `TransactionFilterContext` (Stores "Date Range" while browsing transactions), `WizardContext` (Multi-step form state).
    
- **Scope:** Available only when the user is in that specific section.
    

* * *

## 🚀 How to Use Context

### 1\. The Structure

Every Context file follows the **Provider Pattern**:

1.  **State:** The actual variables (e.g., `user`, `theme`).
    
2.  **Actions:** Functions to change state (e.g., `login()`, `toggleTheme()`).
    
3.  **Provider:** The component that wraps your app.
    
4.  **Hook:** A custom hook (e.g., `useAuth`) so you don't have to import `useContext` everywhere.
    

### 2\. Implementation Guide

#### Step A: Create the Context

*See the "Golden Template" below.*

#### Step B: Wrap your App (Global)

*File: `src/main.tsx`*

TypeScript

```
import { AuthProvider } from '@/context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

#### Step C: Use it in a Component

*File: `src/components/Header.tsx`*

TypeScript

```
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth(); // <--- The Hook

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};
```

* * *

## 🏆 The "Golden Template" for Context

Copy this file when you need to share state. Just find/replace `MyContext` with your specific name (e.g., `FilterContext`).

TypeScript

```
import { createContext, useContext, useState, ReactNode } from 'react';

// --- 1. DEFINE THE SHAPE ---
// What data and functions are available?
interface MyContextType {
  isActive: boolean;
  toggle: () => void;
  setValue: (val: string) => void;
  currentValue: string;
}

// --- 2. CREATE THE CONTEXT ---
// (Initial value is null, but we fix that in the hook)
const MyContext = createContext<MyContextType | null>(null);

// --- 3. CREATE THE PROVIDER ---
export const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentValue, setCurrentValue] = useState('default');

  // Define actions
  const toggle = () => setIsActive((prev) => !prev);
  const setValue = (val: string) => setCurrentValue(val);

  return (
    <MyContext.Provider value={{ isActive, toggle, setValue, currentValue }}>
      {children}
    </MyContext.Provider>
  );
};

// --- 4. CREATE THE CUSTOM HOOK ---
// This ensures you never have to check for 'null' in your components
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};
```