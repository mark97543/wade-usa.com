# React Frontend: Integrating Authentication Context & Basic Routing

**Goal:** Establish the foundation for user authentication in the React frontend (`1_mainApp`) by implementing `AuthContext` and setting up basic protected routes.

* * *

## 1\. Understanding `AuthContext` and `AuthProvider`

The `AuthContext` (`0_Contexts/AuthContext.jsx`) serves as the central hub for managing user login state across the entire application.

- **`AuthContext` (the Context itself):** Created using `createContext()`. It's the "container" that holds the authentication data.
- **`AuthProvider` (the Provider component):**
    - This component wraps your entire application (or parts of it that need authentication data).
    - It manages the authentication state using `useState` hooks:
        - `isAuthenticated`: `true` if logged in, `false` otherwise.
        - `user`: Stores user details (e.g., email, role).
        - `loading`: `true` during initial authentication check.
    - It contains `useEffect` to:
        - Check for an existing `directus_token` in `localStorage` on initial app load.
        - **Crucially:** Listen for `storage` events on the `window` object. This allows real-time synchronization of login/logout status across multiple browser tabs/windows (e.g., if you log out in one tab, other tabs update).
    - It provides `login` and `logout` functions (simulated for now, to be replaced by Directus API calls).
    - It makes all this state and functionality available to its children components via its `value` prop.
- **`useAuth` (the Custom Hook):** A simple helper hook (`useContext(AuthContext)`) that components use to easily access the authentication data provided by `AuthProvider`.

## 2\. Integrating `AuthProvider` and Basic Routes

This step involves modifying your main application entry point (`src/main.jsx`) to wrap your app with the `AuthProvider` and define basic routes using `react-router-dom`.

### Action: Update `src/main.jsx`

1.  \*\*Navigate to your React project's `src` directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp/src
    ```
    
2.  **Open `main.jsx` and replace its entire content** with the code below.
    
    - **Note the import path for `AuthProvider`:** `../../0_Contexts/AuthContext.jsx` assumes `main.jsx` is in `1_mainApp/src/` and `AuthContext.jsx` is in `wade-usa.com/0_Contexts/`. Verify this path.
    - `react-router-dom` is used to define paths (`/`, `/login`, `/dashboard`, etc.).

JavaScript

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../0_Contexts/AuthContext.jsx'; // Adjust path if different

// --- Placeholder Pages (You'll create these next) ---
import LoginPage from './pages/LoginPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wrap your entire application with AuthProvider */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} /> {/* Your main app/homepage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          {/* Add other public routes like /about, /blog listing here */}

          {/* Protected Routes Example */}
          {/* For now, these are basic. We'll build a proper ProtectedRoute component later. */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<div>User Settings (Protected)</div>} />

          {/* Catch-all for 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

* * *

## 3\. Creating Placeholder Pages

You need these basic page components so your application can run without errors after `main.jsx` is updated.

### Action: Create `src/pages` Folder and Page Files

1.  \*\*Navigate to your React project's `src` directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp/src
    ```
    
2.  \*\*Create a new folder named `pages`:\*\*Bash
    
    ```
    mkdir pages
    ```
    
3.  \*\*Navigate into the `pages` folder:\*\*Bash
    
    ```
    cd pages
    ```
    
4.  **Create the following three files** (`LoginPage.jsx`, `UnauthorizedPage.jsx`, `DashboardPage.jsx`) inside `src/pages` and paste the respective code.
    

### File: `src/pages/LoginPage.jsx`

JavaScript

```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Will be used later
import { useAuth } from '../../0_Contexts/AuthContext.jsx'; // Adjust path

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { login } = useAuth(); // Uncomment when ready to use login function
  // const navigate = useNavigate(); // Uncomment when ready to use navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Simulate login for now
    console.log("Attempting to log in with:", email, password);
    if (email === 'test@example.com' && password === 'password') {
        console.log("Simulated login successful!");
        // Here you would call your login function from AuthContext
        // const success = await login(email, password);
        // if (success) {
        //   navigate('/dashboard'); // Redirect to a protected page
        // } else {
        //   setError('Invalid email or password');
        // }
        alert("Simulated login successful! Check console.");
    } else {
        setError('Invalid email or password (simulated)');
    }
  };

  return (
    <div>
      <h2>Login Page (Placeholder)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>Use email: `test@example.com` and password: `password` for simulated login.</p>
    </div>
  );
};

export default LoginPage;
```

### File: `src/pages/UnauthorizedPage.jsx`

JavaScript

```
import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div>
      <h2>Access Denied!</h2>
      <p>You do not have permission to view this page, or you are not logged in.</p>
      <p>Please log in or contact an administrator.</p>
    </div>
  );
};

export default UnauthorizedPage;
```

### File: `src/pages/DashboardPage.jsx`

JavaScript

```
import React from 'react';
import { useAuth } from '../../0_Contexts/AuthContext.jsx'; // Adjust path

const DashboardPage = () => {
  const { user, logout } = useAuth(); // Get user and logout function from context

  const handleLogout = () => {
    logout(); // Call the logout function
    alert("You have been logged out (simulated).");
    // You might want to redirect after logout, e.g., to /login or /
    // navigate('/login'); // If you import and use useNavigate
  };

  return (
    <div>
      <h2>Dashboard Page (Protected)</h2>
      {user ? (
        <p>Welcome, {user.email}! Your role is: {user.role}</p>
      ) : (
        <p>Welcome! You are logged in.</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
```

* * *

## 4\. Testing Your Local Application

After completing the above steps and saving all files:

1.  **Ensure your Docker Compose services are running (Postgres, Directus, Nginx):**
    
    Bash
    
    ```
    cd ~/Documents/wade-usa.com
    sudo docker compose up -d
    ```
    
2.  **Start your React development server:**
    
    Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp
    npm run dev
    ```
    
    This will typically start on `http://localhost:5173`.
    
3.  **Open your web browser** and navigate directly to your React app's development server URL (e.g., `http://localhost:5173`).
    

### Expected Local Behavior:

- **Homepage (`/`):** You should see the default Vite + React starter page.
- **Login Page (`/login`):** Navigate to `http://localhost:5173/login`. You should see the login form.
    - Try logging in with `email: test@example.com`, `password: password`. You should see a "Simulated login successful!" alert.
- **Dashboard Page (`/dashboard`):** Navigate to `http://localhost:5173/dashboard`.
    - If you just "logged in" in the previous step, you should see the dashboard content.
    - Click "Logout" to simulate logging out.
- **Unauthorized Page (`/unauthorized`):** You won't automatically be redirected here yet, but you can navigate to `http://localhost:5173/unauthorized` to see its placeholder.