### Utils Directory (`src/utils/README.md`)

This directory is for logic that is "pure" (input -> output) and does not contain JSX.

```markdown
# 🛠 Utilities & Helpers

**Path:** `src/utils/`

This directory contains pure, stateless helper functions. These functions are the "mechanics" of the application—they transform data, format strings, or handle logic without rendering UI.

## 📏 Rules for Utilities

1.  **Pure Functions Only:** A utility function should always return the same output for the same input.
2.  **No Side Effects:** Do not modify the DOM or global state directly.
3.  **No JSX:** These files should be `.ts`, not `.tsx`. If it returns UI, it belongs in `components/`.

## 🧰 Common Utilities

### `format.ts` (Currency, Dates)
Standardizers for displaying raw data.
- `formatCurrency(amount: number): string` -> "$1,200.00"
- `formatDate(date: string): string` -> "Oct 24, 2025"

### `menu.ts` (Navigation Logic)
Helpers for filtering navigation based on user roles.
- `filterMenu(items: NavItem[], roleId: string): NavItem[]`

### `validation.ts`
Shared regex patterns and validators.
- `isValidEmail(email: string): boolean`

## 🚀 Usage Example

```typescript
import { formatCurrency } from '@/utils/format';

const price = 4500; // Raw number from API
console.log(formatCurrency(price)); // Output: "$4,500.00"