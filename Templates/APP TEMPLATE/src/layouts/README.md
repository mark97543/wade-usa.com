# Layouts Documentation (`src/layouts/`)

**Purpose:** This directory contains the **Architectural Frames** of your application. Layouts are wrapper components that define the permanent structure of a page (like the Sidebar, Header, and Footer) so that your Page components only need to worry about the content inside.

## 🚫 The Golden Rule

**Layouts handle navigation; Pages handle content.**

- ❌ Do not put a "Sidebar" inside every single Page file.
    
- ✅ Create a `DashboardLayout` and wrap your routes with it.
    

* * *

## 📂 Recommended Structure

Since layouts often have their own specific sub-components (like a specific Sidebar for the Dashboard vs. a simple Header for the Login page), keep them distinct.

Plaintext

```
src/layouts/
├── AuthLayout.tsx        # Centered box for Login/Register
├── DashboardLayout.tsx   # Sidebar + Header + Main Content Area
└── PrintLayout.tsx       # Minimal styles for printing reports
```

* * *

## 🚀 How to Use Layouts

There are two main ways to implement layouts in React Router v6+.

### Method A: The "Wrapper" Pattern (Recommended)

*Best for: Applying a layout to a group of routes in `App.tsx`.*

**1\. Create the Layout** It **must** accept an `<Outlet />` (from react-router-dom) or `children` to render the page content.

TypeScript

```
// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/Sidebar';

export const DashboardLayout = () => (
  <div className="flex h-screen">
    <Sidebar />
    <main className="flex-1 overflow-auto p-8">
      <Outlet /> {/* <--- The Page renders here */}
    </main>
  </div>
);
```

**2\. Use it in `App.tsx`**

TypeScript

```
<Route element={<DashboardLayout />}>
  <Route path="/transactions" element={<Transactions />} />
  <Route path="/budget" element={<Budget />} />
</Route>
```

### Method B: The "Manual" Pattern

*Best for: Unique pages that break the mold (like a 404 page).*

TypeScript

```
// src/pages/NotFound.tsx
import { AuthLayout } from '@/layouts/AuthLayout';

export default function NotFound() {
  return (
    <AuthLayout>
       <h1>Page Not Found</h1>
    </AuthLayout>
  );
}
```

* * *

## 🏆 The "Golden Template" for a Dashboard Layout

Copy this into `src/layouts/DashboardLayout.tsx`. It uses a modern "Sidebar Left / Header Top" structure.

TypeScript

```
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/organisms/Header/Header';
// Note: You'll need to create a Sidebar component eventually
// import { Sidebar } from '@/components/organisms/Sidebar/Sidebar'; 

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* LEFT COLUMN: Sidebar (Fixed width) */}
      <aside className="w-64 hidden md:flex flex-col bg-white border-r border-gray-200">
        <div className="p-4 font-bold text-xl text-blue-600">Wade Budget</div>
        {/* <Sidebar /> */}
        <nav className="p-4 space-y-2">
           {/* Temporary placeholders until Sidebar component exists */}
           <div className="p-2 bg-blue-50 text-blue-700 rounded">Dashboard</div>
           <div className="p-2 hover:bg-gray-100 rounded">Transactions</div>
        </nav>
      </aside>

      {/* RIGHT COLUMN: Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP: Sticky Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header 
             siteName="Budget App"
             mainNav={[]} // Pass empty or specific links
             user={null}  // Context will handle this
             onLogout={() => {}} 
             onLogin={() => {}}
          />
        </header>

        {/* BOTTOM: Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </main>
        
      </div>
    </div>
  );
};
```