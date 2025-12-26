# Hooks Documentation (`src/hooks/`)

**Purpose:** This directory contains the **React Mechanics** of your application. These are custom hooks that handle logic, state, and side effects (like fetching data) so your components can remain "dumb" and clean.

## 🚫 The Golden Rule

**Hooks are for Logic, not UI.**

- ❌ Do not return JSX / HTML from a hook.
    
- ✅ Return data, functions, and state variables (booleans, strings, objects).
    

* * *

## 📂 The Two Types of Hooks

### 1\. Data Hooks (The "Brain")

*Prefix: `use[Resource]` (e.g., `useTransactions`, `useProfile`)*

These connect your **API** (src/api) to your **Components**. They handle the "boring stuff":

- Loading spinners (`isLoading`)
    
- Error messages (`error`)
    
- Data refreshment (`refresh()`)
    

### 2\. Utility Hooks (The "Tools")

*Prefix: `use[Verb]` (e.g., `useToggle`, `useDebounce`, `useLocalStorage`)*

These are generic helpers that don't care about your database. They just make React easier to work with.

* * *

## 🚀 How to Use Hooks

### 1\. In a Data Hook

You import the raw API function and wrap it in React state.

TypeScript

```
// src/hooks/useTransactions.ts
import { useState, useEffect } from 'react';
import { getTransactions } from '@/api/transactions'; // <--- Import raw API

export function useTransactions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define the fetch logic
  const refresh = async () => {
    setLoading(true);
    const result = await getTransactions();
    setData(result);
    setLoading(false);
  };

  // Run on mount
  useEffect(() => { refresh(); }, []);

  return { data, loading, refresh };
}
```

### 2\. In a Component

Your component becomes incredibly simple. It just asks for the data.

TypeScript

```
// src/pages/Dashboard.tsx
import { useTransactions } from '@/hooks/useTransactions';

export default function Dashboard() {
  const { data, loading, refresh } = useTransactions();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.length} Transactions</h1>
      <button onClick={refresh}>Reload</button>
    </div>
  );
}
```

* * *

## 🏆 The "Golden Template" for Data Hooks

Copy this template when creating a hook for a new Directus collection.

TypeScript

```
/**
 * DATA HOOK TEMPLATE
 * usage: Copy, rename 'TemplateItem', and swap the API function.
 */

import { useState, useEffect, useCallback } from 'react';
import { getSomeItems, type TemplateItem } from '@/api/template'; // <--- Change this

export function useTemplateData() {
  // 1. STATE
  const [data, setData] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. FETCH LOGIC
  // We use useCallback so this function is stable (doesn't recreate on every render)
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the API layer
      const result = await getSomeItems(); 
      setData(result);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. INITIAL LOAD
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 4. EXPORT
  return { data, isLoading, error, refresh };
}
```