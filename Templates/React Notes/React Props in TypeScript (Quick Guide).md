# React Props in TypeScript (Quick Guide)

**Props** (short for properties) are how you pass data from a **Parent Component** down to a **Child Component**. Think of them like function arguments.

In TypeScript, we use **Interfaces** to strictly define what data a component *is allowed* to receive. This prevents errors by ensuring you always pass the correct data types.

## 1\. The Basic Pattern

Every component that accepts props needs two parts:

1.  **The Interface:** A blueprint defining the types (String? Number? Boolean?).
    
2.  **The Component:** The function that accepts the props as an argument.
    

TypeScript

```
// 1. Define the Interface (The Blueprint)
interface WelcomeProps {
  name: string;        // Must be a string
  age: number;         // Must be a number
  isAdmin: boolean;    // Must be true/false
}

// 2. Define the Component
// We destructure { name, age, isAdmin } directly in the function arguments
export const WelcomeCard = ({ name, age, isAdmin }: WelcomeProps) => {
  return (
    <div className="card">
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
      {isAdmin && <span className="badge">Admin User</span>}
    </div>
  );
};
```

## 2\. Optional Props (`?`)

Sometimes you don't always have data for a specific field. Use a question mark `?` to make a prop optional.

TypeScript

```
interface ButtonProps {
  label: string;       // Required
  color?: string;      // Optional (can be undefined)
}

export const CustomButton = ({ label, color }: ButtonProps) => {
  // If 'color' is provided, use it. Otherwise, default to 'blue'.
  const background = color || 'blue'; 
  
  return <button style={{ background }}>{label}</button>;
};
```

## 3\. Passing Functions (Event Handlers)

You often need to pass functions (like `onClick`) from a parent to a child.

TypeScript

```
interface ToggleProps {
  isOn: boolean;
  onToggle: (newState: boolean) => void; // A function that accepts a boolean and returns nothing
}

export const ToggleSwitch = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <button onClick={() => onToggle(!isOn)}>
      {isOn ? 'Turn OFF' : 'Turn ON'}
    </button>
  );
};
```

## 4\. Passing Children (`children`)

If you want to wrap content *inside* your component (like `<Card>Some Text</Card>`), you use the `children` prop. The standard type is `React.ReactNode`.

TypeScript

```
import React from 'react';

interface LayoutProps {
  title: string;
  children: React.ReactNode; // Accepts text, HTML, or other React components
}

export const PageLayout = ({ title, children }: LayoutProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <main>
        {children} {/* This renders whatever is inside <PageLayout>...</PageLayout> */}
      </main>
    </div>
  );
};
```

## 5\. Usage in Parent Component

When you use your component, TypeScript will yell at you if you forget a required prop or pass the wrong type.

TypeScript

```
// ✅ Correct
<WelcomeCard name="Wade" age={30} isAdmin={true} />

// ❌ Error: Property 'isAdmin' is missing
<WelcomeCard name="Peter" age={18} /> 

// ❌ Error: Type 'string' is not assignable to type 'number'
<WelcomeCard name="Tony" age="Forty" isAdmin={false} />
```

### Summary of Common Types

| **Type** | **Example** | **Description** |
| --- | --- | --- |
| `string` | `"Hello"` | Standard text. |
| `number` | `42` | Integers or floats. |
| `boolean` | `true` | True/False flags. |
| `() => void` | `onClick={handleClick}` | A function that takes no arguments and returns nothing. |
| `(id: number) => void` | `onChange={updateId}` | A function that expects a specific argument. |
| `React.ReactNode` | `<Child />` | Standard type for `children`. |
| `React.CSSProperties` | `{{ color: 'red' }}` | For passing inline styles. |