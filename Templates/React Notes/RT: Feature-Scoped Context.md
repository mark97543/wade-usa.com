# Pattern: Feature-Scoped Context

**Also known as:** The "Provider Pattern" or "Service Injection".

## 1\. Overview

This pattern solves the problem of **"Prop Drilling"** (passing data down through 10 layers of components) by creating a shared "Data Store" for a specific feature or sub-app.

Instead of passing props like `loading`, `data`, and `saveFunction` manually to every button and card, we wrap the entire feature in a **Provider**. Any component inside that wrapper can "hook into" the data instantly.

### The Mental Model

1.  **The Logic Hook (`useFeature`)**: The "Brain." It handles API calls, state, and math.
    
2.  **The Context (`FeatureContext`)**: The "Pipeline." It holds the return value of the Brain.
    
3.  **The Provider (`FeatureProvider`)**: The "Tank." It wraps the UI and fills the Pipeline.
    
4.  **The Consumer (`useFeatureContext`)**: The "Tap." Child components open this to get data.
    

* * *

## 2\. File Structure

When building a new sub-app (e.g., `Dashboard`), organize your files like this:

Plaintext

```
src/pages/Dashboard/
├── context/
│   └── DashboardContext.tsx   <-- The "Glue" (Provider + Consumer)
├── hooks/
│   └── useDashboardLogic.ts   <-- The "Brain" (State + API)
├── components/
│   ├── WidgetA.tsx
│   └── WidgetB.tsx
└── DashboardPage.tsx          <-- The "Wrapper"
```

* * *

## 3\. Generic Implementation Guide

### Step 1: Create the Logic Hook

Write your standard custom hook first. This is just normal React code.

**File:** `src/pages/YourFeature/hooks/useYourFeature.ts`

TypeScript

```
import { useState, useEffect } from "react";

export const useYourFeature = () => {
    // 1. Define State
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Define Actions
    const refreshData = async () => {
        setIsLoading(true);
        // ... fetch API ...
        setIsLoading(false);
    };

    // 3. Return a clean object
    return {
        data,
        isLoading,
        refreshData
    };
};
```

### Step 2: Create the Context & Provider

This is the boilerplate file that makes the magic happen. You can copy-paste this and just rename "YourFeature".

**File:** `src/pages/YourFeature/context/YourFeatureContext.tsx`

TypeScript

```
import React, { createContext, useContext, ReactNode } from "react";
import { useYourFeature } from "../hooks/useYourFeature"; // Import Step 1

// 1. Define the Context Type (Infers return type from your hook)
type FeatureContextType = ReturnType<typeof useYourFeature>;

// 2. Create the Context (Initially null)
const FeatureContext = createContext<FeatureContextType | null>(null);

// 3. Create the Provider Component
export const YourFeatureProvider = ({ children }: { children: ReactNode }) => {
    // A. Initialize the Hook ONCE
    const featureState = useYourFeature();

    // B. Share the result with all children
    return (
        <FeatureContext.Provider value={featureState}>
            {children}
        </FeatureContext.Provider>
    );
};

// 4. Create the Custom Consumer Hook (The "Tap")
export const useYourFeatureContext = () => {
    const context = useContext(FeatureContext);
    
    // Safety Check: Ensure we are inside the provider
    if (!context) {
        throw new Error("useYourFeatureContext must be used within a YourFeatureProvider");
    }
    
    return context;
};
```

### Step 3: Wrap the Parent Page

In your main page file, wrap everything in the Provider. This initializes the "Brain."

**File:** `src/pages/YourFeature/YourFeaturePage.tsx`

TypeScript

```
import { YourFeatureProvider } from "./context/YourFeatureContext";
import { ChildComponent } from "./components/ChildComponent";

export const YourFeaturePage = () => {
    return (
        <YourFeatureProvider>
            {/* Everything inside here shares the same state */}
            <h1>Feature Title</h1>
            <ChildComponent />
        </YourFeatureProvider>
    );
};
```

### Step 4: Consume Data in Children

Now, any component (no matter how deep) can grab the data directly.

**File:** `src/pages/YourFeature/components/ChildComponent.tsx`

TypeScript

```
import { useYourFeatureContext } from "../context/YourFeatureContext";

export const ChildComponent = () => {
    // 1. Pull data directly! No props needed.
    const { data, isLoading, refreshData } = useYourFeatureContext();

    if (isLoading) return <div>Loading...</div>;

    return (
        <button onClick={refreshData}>
            Reload Data (Current: {data})
        </button>
    );
};
```

* * *

## 4\. When to use this?

| **Scenario** | **Use this pattern?** | **Why?** |
| --- | --- | --- |
| **Simple Form** | ❌ No | Just use `useState` or a simple hook. |
| **Shared Data** | ✅ Yes | If 3+ components need the same list (e.g., Transactions). |
| **Global App** | ⚠️ Maybe | Use it for User Auth or Theme, but prefer specific contexts for features. |
| **Complex UI** | ✅ Yes | If you have a Dashboard with Sidebar, Header, and Widgets that all talk to each other. |

## 5\. Benefits

1.  **Single Source of Truth**: There is only one `isLoading` variable for the whole page. No sync issues.
    
2.  **Performance**: API calls happen once in the Provider, not 5 times in 5 widgets.
    
3.  **Clean Code**: Child components don't have messy logic; they just display data.
    
4.  **Refactoring**: You can completely change the Logic Hook (`useYourFeature.ts`) without touching the UI components.