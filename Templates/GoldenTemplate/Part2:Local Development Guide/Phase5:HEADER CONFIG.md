# Module: Dynamic Header & Navigation System



**Path:** `@/components/organisms/Header/Header.tsx` **Type:** Stateless / Presentational ("Dumb Component") **Architecture:** Smart Container (`App.tsx`) → Dumb Presenter (`Header.tsx`)



## 1. Overview



The Header component is completely agnostic of application logic. It does not check permissions. It simply renders the list of links passed to it.

**The Security Logic lives in `App.tsx`**. The App filters the menu based on the user's role *before* passing it to the Header. This ensures unauthorized links never reach the UI layer.

------



## 2. Component Interface (`types.ts`)



These are the updated types supporting the Role-Based Access Control.

TypeScript

```
// @/components/organisms/Header/types.ts

// 1. Navigation Item
export interface NavItem {
  label: string;
  path?: string;
  type?: 'link' | 'dropdown' | 'action';
  
  // ✅ NEW: Array of Role UUIDs allowed to see this
  allowedRoles?: string[]; 
  
  children?: NavItem[];
}

// 2. User Profile
export interface UserProfile {
  name: string;
  email: string;
  isAdmin?: boolean; // Helper for UI specifics
  roleId: string | null; // ✅ NEW: Critical for permission checks
}

// 3. Header Props
export interface HeaderProps {
  siteName: string;
  logoUrl?: string;
  mainNav: NavItem[]; // Expects a PRE-FILTERED list
  user?: UserProfile | null;
  onLogin?: () => void;
  onLogout?: () => void;
}
```

------



## 3. The Logic Layer (`App.tsx`)



This is the "Smart" part of the system. It handles "Crash-Proofing" the user role and filtering the menu.



### A. The Helper Functions



TypeScript

```
// Helper: Safe Role Extraction (Handles String vs Object from Directus)
const getRoleId = (user: any): string | null => {
  if (!user || !user.role) return null;
  return typeof user.role === 'object' ? user.role.id : user.role;
};

// Helper: Recursive Menu Filtering
const filterMenuByRole = (items: NavItem[], userRoleId: string | null): NavItem[] => {
  return items.reduce((acc: NavItem[], item) => {
    // Check Permissions
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!userRoleId || !item.allowedRoles.includes(userRoleId)) {
        return acc; // Skip this item
      }
    }
    // Clone & Filter Children (Recursion)
    const newItem = { ...item };
    if (newItem.children) {
      newItem.children = filterMenuByRole(newItem.children, userRoleId);
    }
    acc.push(newItem);
    return acc;
  }, []);
};
```



### B. The Integration



TypeScript

```
function App() {
  const { user } = useAuth();
  const userRoleId = getRoleId(user); // 1. Get Safe ID

  // 2. Compute Visible Menu
  const visibleMenu = useMemo(() => {
    return filterMenuByRole(masterMenu, userRoleId);
  }, [masterMenu, userRoleId]);

  return (
    <Header 
       mainNav={visibleMenu} // <--- Only safe links passed here
       user={/* ... */} 
    />
  );
}
```

------



## 4. The Directus Integration ("The Directus Way")



This section explains how to power this system dynamically using the Directus Database.



### Phase 1: Directus Schema Setup



We upgraded from a simple "Admin Toggle" to a "Many-to-Many Role System".

1. **Open Collection:** Go to **Settings -> Data Model -> Navigation**.
2. **Remove Old Field:** Delete `requires_admin` if it exists.
3. **Add New Field:**
   - **Type:** Many-to-Many (M2M).
   - **Key:** `allowed_roles`.
   - **Related Collection:** `directus_roles`.
   - **Interface:** List or Checkbox Group.
   - **Note:** If left empty, the link is **Public**.



### Phase 2: The Adapter (`menuAdapter.ts`)



Directus returns roles as an array of objects. We need to flatten them into strings.

TypeScript

```
// @/lib/menuAdapter.ts
export const transformDirectusToNav = (items: any[]): NavItem[] => {
  return items.map((item) => {
    // FLATTEN: [{directus_roles_id: "123"}] -> ["123"]
    const roles = item.allowed_roles?.map((r: any) => r.directus_roles_id) || [];

    return {
      label: item.label,
      path: item.url,
      allowedRoles: roles.length > 0 ? roles : undefined, // Pass undefined if public
      children: item.children ? transformDirectusToNav(item.children) : undefined
    };
  });
};
```



### Phase 3: The API Query



You must ask Directus deeply for the role IDs.

TypeScript

```
readItems('navigation', {
  filter: { parent: { _null: true }, status: { _eq: 'published' } },
  fields: [
    '*',
    'allowed_roles.directus_roles_id',          // Level 1 Roles
    'children.*',
    'children.allowed_roles.directus_roles_id'  // Level 2 Roles
  ]
})
```

------



## 5. Troubleshooting & Ops Notes





### Error: `Cannot read properties of undefined (reading 'id')`



- **Context:** `ProtectedRoute.tsx` or `App.tsx`.
- **Cause:** Directus returning `user.role` as a string UUID instead of an object.
- **Fix:** Use the `getRoleId` helper function provided in Section 3A. Do not access `.id` directly without checking `typeof`.



### Error: `useNavigate() may be used only in the context of a <Router>`



- **Context:** `Header.tsx`.
- **Cause:** The `<Header>` is placed outside the Router context.
- **Fix:** Move `<BrowserRouter>` into `main.tsx` wrapping the entire App.



### Issue: Mobile Buttons look White/Grey



- **Context:** Mobile Menu.
- **Cause:** Browsers apply default styles to `<button>` tags.
- **Fix:** Use `background: transparent; border: none;` or use the custom `<Button>` component inside the mobile loop.



### Ops Note: Role IDs



- **Best Practice:** Do not use role *names* ("Manager"). Use UUIDs.

- **Config:** Store IDs in `.env` or a config file:

  TypeScript

  ```
  const ROLES = {
    ADMIN: '6322d86c-4829-4592-8b65-f63456345', 
    BASIC: '9822d86c-1111-2222-3333-f63456345',
    PENDING: '1234d86c-4444-5555-6666-f63456345',
  };
  ```
