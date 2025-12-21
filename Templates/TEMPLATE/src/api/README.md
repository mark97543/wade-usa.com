&nbsp;

Here is a comprehensive `README.md` specifically for your API layer. You can place this file at `services/budget/src/api/README.md` to guide yourself and future developers.

* * *

# API Layer Documentation (`src/api/`)

**Purpose:** This directory acts as the "Switchboard Operator" for the application. It handles all communication with the Directus backend.

### 🚫 Rules of the Road

1.  **No React Code:** Never import `useState`, `useEffect`, or React components here.
    
2.  **Pure TypeScript:** These files should only contain async functions and type definitions.
    
3.  **One File Per Collection:** If you have a `budget_transactions` table, create a `transactions.ts` file.
    

* * *

## 1\. The Anatomy of an API File

Every file in this folder follows the exact same 3-part structure:

### Part A: The Setup

You import the "Phone Line" (`client`) and the "Commands" (Directus SDK functions).

TypeScript

```
import { client } from '@/lib/directus';
import { readItems, createItem, ... } from '@directus/sdk';
```

### Part B: The Contract (Types)

You define what the data looks like so TypeScript can catch errors.

TypeScript

```
export interface Transaction {
  id: number;
  item: string;
  amount: number;
}
```

### Part C: The Actions (CRUD)

You write async functions that strictly return data.

TypeScript

```
export const getTransactions = async () => {
  return await client.request(readItems('transactions'));
}
```

* * *

## 2\. How to Use It

Once you create an API file, you import these functions into your **Hooks** or **Pages**.

### Scenario A: Fetching a List (In a Hook)

*Use this when loading data on page load.*

TypeScript

```
// src/hooks/useTransactions.ts
import { getTransactions } from '@/api/transactions'; // <--- Import logic

useEffect(() => {
  const loadData = async () => {
    const data = await getTransactions(); // <--- Call logic
    setTransactions(data);
  };
  loadData();
}, []);
```

### Scenario B: Submitting a Form (In a Component)

*Use this when a user clicks "Save".*

TypeScript

```
// src/pages/AddTransaction.tsx
import { createTransaction } from '@/api/transactions'; // <--- Import logic

const handleSubmit = async () => {
  await createTransaction({
    item: "Coffee",
    amount: 5.50
  });
  alert("Saved!");
};
```

* * *

## 3\. Why Use This Pattern?

| **Feature** | **Benefit** |
| --- | --- |
| **Separation** | Your React components don't clutter with complex API URLs or headers. |
| **Reusability** | You can call `getTransactions()` in your Dashboard, your Sidebar, and your Reports page without rewriting code. |
| **Type Safety** | If the backend changes a field name, you only update the interface in **one file**, and TypeScript fixes the rest. |

* * *

## 4\. The "Golden Template" for `api.ts`

Copy and paste this into any new API file (e.g., `src/api/products.ts`), then just do a "Find & Replace" on the Collection Name and Type.

TypeScript

```
/**
 * API TEMPLATE
 * usage: Copy this file, rename 'TemplateData', and change 'COLLECTION_NAME'.
 */

import { client } from '@/lib/directus';
import { 
  readItems, 
  createItem, 
  updateItem, 
  deleteItem, 
  type Query 
} from '@directus/sdk';

// --- 1. CONFIGURATION ---
const COLLECTION = 'CHANGE_ME_COLLECTION_NAME'; // e.g. 'budget_transactions'

// --- 2. TYPE DEFINITIONS ---
export interface TemplateData {
  id: number;
  status: string;
  sort?: number;
  date_created?: string;
  // Add your specific fields below
  name: string;
  description?: string;
}

// --- 3. API FUNCTIONS ---

/**
 * GET ALL (With optional filters)
 */
export const getAllItems = async (queryParams?: Query<any, TemplateData>) => {
  return await client.request(
    readItems(COLLECTION, {
      sort: ['-date_created'], // Default sort
      limit: 100,              // Safety limit
      ...queryParams,          // Merge custom filters
    })
  );
};

/**
 * GET ONE (By ID)
 */
export const getItemById = async (id: number | string) => {
  return await client.request(
    readItems(COLLECTION, {
      filter: { id: { _eq: id } }
    })
  );
};

/**
 * CREATE NEW
 */
export const createNewItem = async (data: Partial<TemplateData>) => {
  return await client.request(
    createItem(COLLECTION, data)
  );
};

/**
 * UPDATE EXISTING
 */
export const updateExistingItem = async (id: number | string, data: Partial<TemplateData>) => {
  return await client.request(
    updateItem(COLLECTION, id, data)
  );
};

/**
 * DELETE
 */
export const deleteItemById = async (id: number | string) => {
  return await client.request(
    deleteItem(COLLECTION, id)
  );
};
```