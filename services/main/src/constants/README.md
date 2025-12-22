Here is the `README.md` for your **Constants** folder. Place this file at `services/budget/src/constants/README.md`.

* * *

# Constants Documentation (`src/constants/`)

**Purpose:** This directory holds the "Magic Numbers" and "Hardcoded Settings" of your application. These are values that rarely change but should **not** be buried deep inside your component code.

### 🚫 What NOT to put here

1.  **Secrets:** Never put passwords, API Keys, or Tokens here. Use `.env` files for those.
    
2.  **Dynamic Content:** Do not put user data or things that change daily here. Use the Database (Directus) for that.
    

* * *

## 📂 Recommended Structure

For a simple app, a single file is fine. For complex apps, break them down.

Plaintext

```
src/constants/
├── index.ts        # (Optional) Export everything for easy import
├── config.ts       # App-wide settings (Pagination limits, Currency)
├── enums.ts        # Fixed lists (Transaction Types, Statuses)
└── regex.ts        # Validation patterns (Email regex, Password rules)
```

* * *

## 🚀 How to Use Constants

### 1\. Defining a Constant

*Best Practice: Use `UPPER_CASE` for simple values and `PascalCase` for objects.*

TypeScript

```
// src/constants/config.ts

export const APP_CURRENCY = 'USD';
export const MAX_FILE_SIZE_MB = 5;

// Freeze objects so nobody can accidentally change them in the app
export const TRANSACTION_TYPES = Object.freeze({
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    TRANSFER: 'transfer'
});
```

### 2\. Using it in a Component

*Now, if you want to change "deposit" to "credit" in the future, you change it in ONE place, not 50 files.*

TypeScript

```
import { TRANSACTION_TYPES } from '@/constants/config';

if (type === TRANSACTION_TYPES.WITHDRAWAL) {
    applyFee();
}
```

* * *

## 💡 The "Why?" (Scenario)

Imagine your client says: *"Can we change the Low Balance Warning from $100 to $50?"*

- **❌ The Bad Way:** You search through 20 files looking for the number `100`. You accidentally change a "100% width" CSS style to "50% width". The app breaks.
    
- **✅ The Good Way:** You open `src/constants/config.ts`, change `LOW_BALANCE_THRESHOLD` to `50`, and go home early.
    

* * *

## 🏆 The "Golden Template" for Budget App Constants

Copy this into `src/constants/config.ts` to get started.

TypeScript

```
/**
 * Application Configuration & Constants
 */

// --- VISUAL & FORMATTING ---
export const CURRENCY_CODE = 'USD';
export const LOCALE = 'en-US';
export const DATE_FORMAT_DISPLAY = 'MMM dd, yyyy'; // e.g., Dec 25, 2025

// --- BUSINESS LOGIC ---
export const BUDGET_LIMITS = {
    LOW_BALANCE_WARNING: 100, // Warn user if balance drops below $100
    MONTHLY_SPENDING_CAP: 5000,
};

// --- API & DATA ---
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};

// --- VALIDATION RULES ---
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    // Regex: simple email check
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
};

// --- DIRECTUS COLLECTION NAMES ---
// (Maps code-friendly names to actual DB table names)
export const COLLECTIONS = {
    TRANSACTIONS: 'budget_transactions',
    CATEGORIES: 'budget_categories',
    ACCOUNTS: 'budget_accounts',
} as const;
```