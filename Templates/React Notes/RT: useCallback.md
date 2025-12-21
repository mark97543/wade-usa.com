# React Tutorial: `useCallback`

### 1\. What is it?

`useCallback` is a React Hook that **"caches" a function definition**.

Normally, when a component re-renders, **every function inside it is re-created**. `useCallback` tells React: *"Save this function and don't re-create it unless specific data changes."*

### 2\. The Problem: "Referential Equality"

In JavaScript, two functions that look identical are actually different in memory if created separately.

JavaScript

```
// In standard JS:
const funcA = () => console.log("Hi");
const funcB = () => console.log("Hi");

console.log(funcA === funcB); // FALSE. They are different "objects" in memory.
```

**In React Component Life-cycle:**

1.  **Render 1:** React creates `handleClick` (Address: 0x111).
    
2.  **State Change:** The component re-renders.
    
3.  **Render 2:** React creates a **new** `handleClick` (Address: 0x222).
    
4.  **The Issue:** Any child component receiving this function thinks, *"Oh, I got a new prop! I better re-run my effects or re-render!"*
    

### 3\. Your Specific Bug (The "Focus Loss" Issue)

This is exactly what happened in your `Transaction_modal` code:

1.  **You Typed a Letter:** The state `data` updated.
    
2.  **Re-Render:** `TransactionModal` ran again.
    
3.  **New Function:** The line `onClose={() => setIsOpen(false)}` created a **brand new function**.
    
4.  **Child Component Reacts:** Your `<Modal>` component received this new function.
    
5.  **Effect Triggers:** Inside `<Modal>`, you had this dependency:
    
    TypeScript
    
    ```
    useEffect(() => {
       // Code that sets focus to the modal
    }, [onClose]); // <--- DEPENDENCY
    ```
    
6.  **Result:** Because `onClose` was "new", the effect ran again, stealing the focus from your input field.
    

### 4\. The Solution: `useCallback` Syntax

You wrap your function in the hook and provide a **Dependency Array** (just like `useEffect`).

TypeScript

```
const memoizedFunction = useCallback(() => {
  doSomething(a, b);
}, [a, b]); // Only re-create if 'a' or 'b' changes
```

### 5\. Practical Example

Here is a simple example. Imagine a parent component passing a function to a child.

**Without `useCallback` (Bad for performance/Effects):**

TypeScript

```
const Parent = () => {
    const [count, setCount] = useState(0);

    // ❌ Created fresh on EVERY click/render
    const handleClick = () => {
        console.log("Clicked");
    };

    return <Child onClick={handleClick} />;
}
```

**With `useCallback` (Good):**

TypeScript

```
const Parent = () => {
    const [count, setCount] = useState(0);

    // ✅ Created ONCE. The memory address stays the same forever.
    const handleClick = useCallback(() => {
        console.log("Clicked");
    }, []); // Empty array = never change

    return <Child onClick={handleClick} />;
}
```

### 6\. When should you use it?

You don't need it for *every* function (that would be messy). Use it in these 2 specific cases:

1.  **Dependency Lists:** If you pass a function into a `useEffect` dependency array (like your `updateTx` function in `useTransactions`).
    
2.  **Props to Optimized Children:** If you pass a function to a child component that relies on referential equality (like your `Modal` that checks if `onClose` changed).
    

### Summary

- **Without `useCallback`:** Functions are "born" and "die" on every render.
    
- **With `useCallback`:** The function is "immortal" until its dependencies change.