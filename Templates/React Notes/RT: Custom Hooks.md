# Custom Hooks in React

A guide to understanding, building, and using Custom Hooks to separate logic from UI.

## 1\. What is a Custom Hook?

In React, a **Custom Hook** is simply a JavaScript function that starts with the word `use` and calls other Hooks (like `useState`, `useEffect`, `useCallback`).

It allows you to extract **stateful logic** from a component so it can be tested independently and reused.

### The Mental Model

- **The Component (`Transactions.tsx`)**: The "Body." It handles appearance, layout, and user interaction (clicks, typing).
    
- **The Hook (`useTransactions.tsx`)**: The "Brain." It handles memory (state), thinking (calculations), and communication (API calls).
    

* * *

## 2\. Why Use This Pattern?

Looking at your `useTransactions` file, we see three major benefits:

### A. Separation of Concerns

Instead of a massive 300-line component file, you split the code:

- **Logic File:** Handles fetching data, pagination math, and saving edits.
    
- **UI File:** Handles rendering the Table and Modal.
    

### B. Encapsulation (Black Box)

The component doesn't need to know *how* the API works.

- **Component asks:** "Give me `currentData` and a `save` function."
    
- **Hook answers:** "Here they are."
    
- The component doesn't care if you use `fetch`, `axios`, or magic; it just renders the result.
    

### C. Cleaner Returns

Your hook gathers scattered state variables (`isOpen`, `selectedItem`, `transactions`, `loading`) and packages them into a single, clean object for the component to use.

* * *

## 3\. Anatomy of `useTransactions`

Here is a breakdown of how your specific hook is structured.

### Step 1: State Management

The hook owns the "truth" of the application.

TypeScript

```
// It holds the raw data
const [transactions, setTransactions] = useState<Transaction[]>([]);
// It holds UI state (is the modal open?)
const [isOpen, setIsOpen] = useState(false);
// It holds temporary state (what item are we editing?)
const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
```

### Step 2: "Smart" Actions

The hook defines functions that do the heavy lifting.

TypeScript

```
const confirmPaidAction = async () => {
    // 1. Validation
    if (!selectedItem) return;

    // 2. Optimistic Update (Update UI before API finishes)
    setTransactions(prev => ...);

    // 3. API Communication
    await api.updateTransaction(...);
};
```

### Step 3: Effects

The hook decides *when* things happen (like loading data on mount).

TypeScript

```
useEffect(() => {
    loadData();
}, []); // Runs once when the component mounts
```

### Step 4: The Return Object

Finally, the hook exposes **only what the component needs**.

TypeScript

```
return {
    currentData,      // The processed list for the table
    columns,          // Table configuration
    isOpen,           // Modal state
    setIsOpen,        // Modal controller
    confirmPaidAction // The "Save" button handler
};
```

* * *

## 4\. How to Use It

Using a custom hook is as simple as calling a function.

TypeScript

```
// pages/Transactions.tsx
import { useTransactions } from './useTransactions';
import { TransactionModal } from './Transaction_files/Transaction_modal';

export const Transactions = () => {
    // 1. Initialize the hook
    const { 
        currentData, 
        isOpen, 
        setIsOpen, 
        selectedItem, 
        setSelectedItem, 
        confirmPaidAction 
    } = useTransactions();

    return (
        <div className="page-container">
            {/* 2. Pass data to your Table */}
            <Table data={currentData} />

            {/* 3. Connect the Hook to your Modal */}
            <TransactionModal 
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                data={selectedItem}
                setData={setSelectedItem}
                onConfirm={confirmPaidAction} // Hook handles the logic!
            />
        </div>
    );
};
```

* * *

## 5\. Rules of Custom Hooks

When building your own hooks, remember these three rules:

1.  **Name it `use...`**: Always start the filename and function name with `use` (e.g., `useForm`, `useUser`). This tells React to treat it specially.
    
2.  **Top Level Only**: Never call a hook inside a loop, condition, or nested function.
    
    TypeScript
    
    ```
    // ❌ Bad
    if (isAdmin) { const [data] = useData(); }
    
    // ✅ Good
    const [data] = useData();
    if (isAdmin) { ... }
    ```
    
3.  **Call Hooks from React Functions**: Only call hooks from inside a Component or another Custom Hook.