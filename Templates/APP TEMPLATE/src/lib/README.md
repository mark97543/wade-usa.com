# Lib Documentation (`src/lib/`)

**Purpose:** This directory is the home for **Third-Party Configuration**. If you are installing a library (like Directus, Firebase, Axios, or Stripe) and need a single place to set it up with your API keys and default settings, it goes here.

## 🚫 Lib vs. Utils: The Difference

It is easy to confuse these two. Here is the rule:

- **`src/utils/` (Helpers):** Code *you* write to do math or formatting.
    
    - *Example:* `formatCurrency(100)` -> `"$100.00"`
- **`src/lib/` (Config):** Code that *initializes* someone else's code.
    
    - *Example:* `directus.ts` creates the connection to the database.

* * *

## 📂 Recommended Structure

You usually have one file per major external library.

Plaintext

```
src/lib/
├── directus.ts      # The database connection (Crucial)
├── axios.ts         # (Optional) If you need a custom HTTP client
├── firebase.ts      # (Optional) If you add Firebase later
└── stripe.ts        # (Optional) Payment processing config
```

* * *

## 🚀 How to Use Lib Files

### 1\. The Setup (Inside `src/lib/`)

You configure the tool once, so you don't have to pass API keys around your app.

TypeScript

```
// src/lib/analytics.ts
import Analytics from 'some-analytics-tool';

// Configure it once
export const analytics = Analytics.init({
  apiKey: import.meta.env.VITE_ANALYTICS_KEY,
  trackAuto: true
});
```

### 2\. The Usage (Anywhere else)

You import the *instance*, not the library.

TypeScript

```
// src/pages/Dashboard.tsx
import { analytics } from '@/lib/analytics'; // <--- Import your config

useEffect(() => {
  analytics.track('Page View');
}, []);
```

* * *

## 🏆 The "Golden Template" for Directus

This is the most important file in your app. It handles the **Authentication Cookies** automatically. Copy this into `services/budget/src/lib/directus.ts`.

TypeScript

```
import { createDirectus, rest, authentication } from '@directus/sdk';
import type { Schema } from '@/types/models'; // Ensure your types exist!

// 1. Get the URL from Environment Variables
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('Missing VITE_API_URL in .env file');
}

// 2. Create the Client
export const client = createDirectus<Schema>(apiUrl)
  .with(rest({
    // CRITICAL: This allows cookies to travel between 
    // budget.wade-usa.com and api.wade-usa.com
    onRequest: (options) => ({ ...options, credentials: 'include' }),
  }))
  .with(authentication('cookie', {
    // Helper options for auto-refreshing tokens
    autoRefresh: true,
  }));
```