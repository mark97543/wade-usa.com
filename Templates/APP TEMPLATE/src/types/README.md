### 1\. Types Directory (`src/types/README.md`)

This directory is for **shared** domain models. Component-specific props (like `HeaderProps`) should remain in their respective component folders.

Markdown

```
# 📖 Types & Interfaces

**Path:** `src/types/`

This directory houses the global TypeScript definitions (models) used across the application. These interfaces represent the "Shape of Data" returned by our backend (Directus) or used in global application state.

## 📂 Structure Strategy

- **Global Domain Models:** If an interface is used by *more than one* page or component (e.g., `User`, `Product`), it belongs here.
- **Component Props:** If an interface is *only* used by a specific component (e.g., `ButtonProps`), define it inside that component's file or folder (`Button.tsx` or `types.ts` inside the component folder). Do not put it here.

## 📝 Key Files

### `user.ts`
Defines the current user's session and authentication context.
- **`User`**: Matches the Directus `directus_users` schema (id, first_name, email, role).
- **`AuthContextType`**: Defines the shape of the `useAuth()` hook (login, logout, isAdmin).

### `theme.ts` (Planned)
Will define the shape of the `Global_Theme` singleton fetched from Directus.

## 🚀 Usage Example

```typescript
import type { User } from '@/types/user';

function WelcomeMessage({ user }: { user: User }) {
  return <h1>Hello, {user.first_name}</h1>;
}
```