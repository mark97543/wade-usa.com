# 🚀 Dynamic Header Component (`Header.tsx`)



Path: src/components/organisms/Header/Header.tsx

Role: Purely Presentational (The "Dumb" Component)

Architectural Philosophy: Smart App / Dumb Header



## 1. Overview and Philosophy



This component renders the entire site header, including branding, navigation, and user authentication status.

**Crucial Principle:** This Header component is completely *agnostic* (unaware) of your application's security or role logic (Admin, Basic, etc.). It trusts that the parent component (`App.tsx`) has already filtered the links based on the user's permissions.

| **Feature**        | **Status**           | **Description**                                              |
| ------------------ | -------------------- | ------------------------------------------------------------ |
| **Security**       | External (Smart App) | The parent filters the `mainNav` prop.                       |
| **Responsiveness** | Internal             | Automatically collapses into a Hamburger menu.               |
| **Navigation**     | Internal             | Uses `react-router-dom` (`Link`, `useNavigate`).             |
| **Theming**        | Internal             | Uses global CSS variables (`--danger-color`, etc.) and the `<Button>` component. |

------



## 2. Prerequisites & Dependencies



To use this component, the following must be correctly imported and functional:

| **Dependency**     | **Type**         | **Location (Example)**                              |
| ------------------ | ---------------- | --------------------------------------------------- |
| **Router Context** | External         | Must be wrapped in `<BrowserRouter>` in `main.tsx`. |
| **Button**         | Atomic Component | `@/components/atoms/Button/Button`                  |
| **Dropdown**       | Atomic Component | `@/components/molecules/Dropdown/Dropdown`          |
| **Hamburger**      | Atomic Component | `@/components/atoms/Hamburger/Hamburger`            |
| **CSS Modules**    | Styling          | `./Header.module.css` (for layout and breakpoints)  |

------



## 3. Data Interfaces (Props API)



The component expects a single object (`HeaderProps`) containing all necessary information.



### A. Main Props (`HeaderProps`)



| **Prop**      | **Type**     | **Required** | **Description**                                              |
| ------------- | ------------ | ------------ | ------------------------------------------------------------ |
| `siteName`    | `string`     | **Yes**      | The main brand name displayed next to the logo.              |
| **`mainNav`** | `NavItem[]`  | **Yes**      | **The array of links to render.** This list must be pre-filtered by the parent. |
| `user`        | `UserProfile | null`        | No                                                           |
| `logoUrl`     | `string`     | No           | Full URL to the logo image.                                  |
| `onLogin`     | `() => void` | No           | Callback function for the **Login** button click.            |
| `onLogout`    | `() => void` | No           | Callback function for the "Log Out" dropdown item.           |



### B. Navigation Item (`NavItem`)



This defines the structure of each link.

| **Field**  | **Type**    | **Note**                                                     |
| ---------- | ----------- | ------------------------------------------------------------ |
| `label`    | `string`    | The display text (e.g., "Home").                             |
| `path`     | `string`    | The URL route (e.g., `/profile`).                            |
| `children` | `NavItem[]` | **Optional.** If present, the item renders as a dropdown trigger. |



### C. User Profile (`UserProfile`)



The format the Header expects for a logged-in user.

| **Field** | **Type**  | **Note**                                                     |
| --------- | --------- | ------------------------------------------------------------ |
| `name`    | `string`  | Displayed in the top-right profile trigger.                  |
| `email`   | `string`  | Displayed under the name in the dropdown subtitle.           |
| `isAdmin` | `boolean` | **Used for visual badging only.** (The App uses `roleId` for security). |

## 4. Usage Guide & Scenarios (The 4-Tier System)



The following examples use a single **Master Menu** and the filtering logic in `App.tsx` to determine what the Header ultimately renders.



### Master Menu Definition



This array, defined once in your `App.tsx`, contains all possible links.

TypeScript

```
// Defined in App.tsx using the ROLES constants
const MASTER_MENU: NavItem[] = [
  // 1. PUBLIC: Visible to everyone (no allowedRoles)
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  
  // 2. BASIC/ADMIN: Orders access is for approved customers
  { 
    label: 'My Orders', 
    path: '/orders', 
    allowedRoles: [ROLES.BASIC, ROLES.ADMIN] 
  },
  
  // 3. ADMIN ONLY: Restricted features
  { 
    label: 'Management', 
    allowedRoles: [ROLES.ADMIN], 
    children: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Users', path: '/admin/users' }
    ] 
  }
];
```



### Scenario A: Public/Guest View



- **Role State:** `user` is `null`.
- **App Logic Result:** The filter function sees no `userRoleId`, so it removes all links with `allowedRoles`.

| **Header Renders (Input Data)**   | **Description**              |
| --------------------------------- | ---------------------------- |
| `mainNav`: **`[Home, Products]`** | Only public links remain.    |
| **User Dropdown:**                | **Login Button** is visible. |



### Scenario B: Pending User



- **Role State:** `userRoleId` = `ROLES.PENDING` UUID.
- **App Logic Result:** The filter removes any item that requires `BASIC` or `ADMIN` (since PENDING is not in those lists).

| **Header Renders (Input Data)**   | **Description**                                              |
| --------------------------------- | ------------------------------------------------------------ |
| `mainNav`: **`[Home, Products]`** | *Note:* This depends on whether you allow PENDING to see public links. If you want them to *only* see Profile, you would need to add `allowedRoles: [ROLES.PENDING, ROLES.BASIC, ROLES.ADMIN]` to the Home/Products links as well. |
| **User Dropdown:**                | **Profile Dropdown** is visible.                             |



### Scenario C: Basic User



- **Role State:** `userRoleId` = `ROLES.BASIC` UUID.
- **App Logic Result:** The filter keeps items that require `BASIC` or are public.

TypeScript

```
// Example App.tsx rendering logic:
const myBasicUser = { name: "Jane Q.", email: "jane@basic.com", isAdmin: false };
const visibleMenu = filterMenuByRole(MASTER_MENU, ROLES.BASIC);

<Header 
  siteName="Wade USA"
  mainNav={visibleMenu} // Renders: [Home, Products, My Orders]
  user={myBasicUser}
  onLogout={logout}
/>
```



### Scenario D: Admin User



- **Role State:** `userRoleId` = `ROLES.ADMIN` UUID.
- **App Logic Result:** The filter keeps all public, BASIC, and ADMIN links.

TypeScript

```
// Example App.tsx rendering logic:
const adminUser = { name: "Admin T.", email: "t@admin.com", isAdmin: true };
const visibleMenu = filterMenuByRole(MASTER_MENU, ROLES.ADMIN);

<Header 
  siteName="Wade USA"
  mainNav={visibleMenu} // Renders EVERYTHING (including the Management dropdown)
  user={adminUser}
  onLogout={logout}
/>
// Note: The 'isAdmin: true' ensures the badge in the user dropdown is visible.
```
