## 1\. Create the `ProtectedRoute` Component

This component will be the "gatekeeper" that checks if a user is authenticated.

**Action:** Create `src/components/ProtectedRoute.jsx`

1.  \*\*Navigate to your React project's `src` directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp/src
    ```
    
2.  **Create a new folder named `components`** (if it doesn't already exist):Bash
    
    ```
    mkdir -p components
    ```
    
    *(The `-p` flag ensures that if the directory exists, it won't throw an error).*
    
3.  \*\*Navigate into the `components` folder:\*\*Bash
    
    ```
    cd components
    ```
    
4.  **Create a new file named `ProtectedRoute.jsx`** and paste the code below.
    
    - **Note the import path for `useAuth`:** `../../0_Contexts/AuthContext.jsx` assumes `ProtectedRoute.jsx` is in `1_mainApp/src/components/` and `AuthContext.jsx` is in `wade-usa.com/0_Contexts/`. Verify this path.

JavaScript

```
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../0_Contexts/AuthContext.jsx'; // Adjust path if needed

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Show a simple loading message while checking auth status
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Optional: Role-based access control (for later, if needed)
  // If allowedRoles are specified AND the user's role is NOT in allowedRoles, redirect to unauthorized
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and authorized if roles checked), render the content
  return <Outlet />;
};

export default ProtectedRoute;
```

5.  **Save the `ProtectedRoute.jsx` file.**

* * *

## 2\. Update Routes in `src/main.jsx`

Now, you'll use the `ProtectedRoute` to actually protect your dashboard route.

**Action:** Modify `src/main.jsx`

1.  \*\*Navigate back to your `src` directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp/src
    ```
    
2.  **Open `main.jsx` and update it** to include the `ProtectedRoute` import and wrap your protected routes.
    

JavaScript

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../0_Contexts/AuthContext.jsx';

// Import your page components
import LoginPage from './pages/LoginPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

// Import the ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Adjust path if needed

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wrap your entire application with AuthProvider */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} /> {/* Your main app/homepage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          {/* Add other public public routes here */}

          {/* Protected Routes (now actually protected!) */}
          <Route element={<ProtectedRoute />}> {/* This is the gatekeeper */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<div>User Settings (Protected)</div>} />
            {/* Add more generally protected routes here */}
          </Route>

          {/* Optional: Role-specific Protected Routes (for later, if needed) */}
          {/* Example: only 'Admin' users can access '/admin-panel' */}
          {/* <Route element={<ProtectedRoute allowedRoles={['Admin', 'NTK']} />}>
            <Route path="/admin-panel" element={<div>Admin Only Panel</div>} />
          </Route> */}

          {/* Catch-all for 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

3.  **Save the `main.jsx` file.**

* * *

## 3\. Testing Your Protected Route

Now, let's test if the protection works as expected.

### Action: Test in Browser

1.  **Ensure your React development server is running:**
    - In your terminal, navigate to `~/Documents/wade-usa.com/1_mainApp`
    - Run `npm run dev`
2.  **Open your web browser.**

### Test Scenarios:

- **Scenario 1: Accessing Protected Route when NOT Logged In**
    
    - Navigate directly to: `http://localhost:5173/dashboard`
    - **Expected:** You should be immediately redirected to `http://localhost:5173/login`. The browser should show the "Login Page (Placeholder)". This confirms the protection is active.
- **Scenario 2: Logging In and Accessing Protected Route**
    
    - From `http://localhost:5173/login`, use the simulated credentials:
        - **Email:** `test@example.com`
        - **Password:** `password`
    - Click the "Login" button.
    - **Expected:** You should see the "Simulated login successful!" alert. After dismissing it, you should be redirected to `http://localhost:5173/dashboard`, and the "Dashboard Page (Protected)" content should be visible. This confirms authentication and redirection work.
- **Scenario 3: Accessing Protected Route After Logout**
    
    - While on `http://localhost:5173/dashboard` (after logging in), click the "Logout" button.
    - **Expected:** You should see an "You have been logged out (simulated)." alert. If you try to navigate back to `http://localhost:5173/dashboard` immediately, you should again be redirected back to `http://localhost:5173/login`. This confirms logout and re-protection.