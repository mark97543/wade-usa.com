### **Step 1: Install the Directus SDK**

First, you need to install the official Directus JavaScript SDK in your React project. This SDK makes it much easier to interact with your Directus API.

1.  **Open your local terminal** (your R2-D2 machine).
    
2.  \*\*Navigate into your React project directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp
    ```
    
3.  \*\*Install the Directus SDK:\*\*Bash
    
    ```
    npm install @directus/sdk
    ```
    

Once the installation is complete, you can proceed to the next step.

### **Step 2: Modify `AuthContext.jsx` to use the Directus SDK**

We'll update your `AuthContext.jsx` file to import and use the Directus SDK for authentication and fetching user data.

**Crucial Point:** Your React frontend needs to know the URL of your **live Directus API** (`https://api.wade-usa.com`). We'll pull this from your `.env.development` (for local testing against your live API) and `.env.production` (for the deployed app).

1.  **Open your `vite.config.js` file** in `~/Documents/wade-usa.com/1_mainApp/vite.config.js`.
    
    - Ensure you have the `resolve.alias` for `@contexts` as discussed:JavaScript
        
        ```
        import { defineConfig } from 'vite';
        import react from '@vitejs/plugin-react';
        import path from 'path';
        
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        
        export default defineConfig({
          plugins: [react()],
          resolve: {
            alias: {
              '@components': path.resolve(__dirname, '../_components'),
              '@contexts': path.resolve(__dirname, '../0_Contexts'), // Ensure this alias exists
            },
          },
        });
        ```
        
2.  **Open your `1_mainApp/.env.development` file** (create it if it doesn't exist yet).
    
    - Add the Directus API URL:
    
    ```
    VITE_DIRECTUS_API_URL=https://api.wade-usa.com
    ```
    
    - You will create a `1_mainApp/.env.production` later with the same variable when deploying.
3.  **Open your `0_Contexts/AuthContext.jsx` file.**
    
    - **Replace the entire content of `AuthContext.jsx` with the code below.**

JavaScript

```
import React, { createContext, useState, useEffect, useContext } from "react";
import { Directus } from '@directus/sdk'; // <-- Import Directus SDK

// 1. Create the Auth Context
const AuthContext = createContext(null);

// Initialize Directus SDK client
// It uses VITE_DIRECTUS_API_URL from your .env files
// For local dev, this will point to your live Droplet Directus instance
const directus = new Directus(import.meta.env.VITE_DIRECTUS_API_URL);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect to check authentication status on mount and listen for storage changes
    useEffect(() => {
        const checkAuthStatus = async () => {
            // Check for existing token in localStorage
            const token = localStorage.getItem('directus_token');

            if (token) {
                // If token exists, try to refresh it or fetch user details
                try {
                    // This attempts to fetch the current user using the stored token
                    // Directus SDK automatically uses tokens stored in localStorage by itself after login.
                    const currentUser = await directus.users.me.read();
                    setIsAuthenticated(true);
                    // Store the user object from Directus response. This will contain roles.
                    setUser(currentUser);
                    console.log("Authenticated user data:", currentUser);
                } catch (error) {
                    console.error("Authentication check failed:", error);
                    // If token is invalid or expired, clear it
                    localStorage.removeItem('directus_token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false); // Authentication check is complete
        };

        checkAuthStatus(); // Initial check on component mount

        // Listener for 'storage' events to synchronize state across tabs/windows on the same domain.
        const handleStorageChange = async (event) => {
            if (event.key === 'directus_token') {
                if (event.newValue === null) {
                    // Token removed (user logged out from another tab/app)
                    setIsAuthenticated(false);
                    setUser(null);
                } else if (event.newValue) {
                    // Token added/changed (user logged in from another tab/app)
                    // Re-run full check to validate new token and fetch user details
                    await checkAuthStatus();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function: remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    // Function to handle login with Directus API
    const login = async (email, password) => {
        try {
            // Use Directus SDK for login
            // The SDK handles storing the access_token in localStorage automatically
            await directus.auth.login({ email, password });
            
            // After successful login, fetch the authenticated user's details
            const currentUser = await directus.users.me.read();
            setIsAuthenticated(true);
            setUser(currentUser);
            console.log("Login successful! User:", currentUser);
            return true; // Indicate success
        } catch (error) {
            console.error("Login failed:", error);
            setIsAuthenticated(false);
            setUser(null);
            return false; // Indicate failure
        }
    };

    // Function to handle logout with Directus API
    const logout = async () => {
        try {
            await directus.auth.logout(); // Use Directus SDK for logout
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('directus_token'); // Ensure token is removed from localStorage
            console.log("Logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
```

### **Explanation of Changes in `AuthContext.jsx`:**

1.  **`import { Directus } from '@directus/sdk';`**: Imports the necessary class from the SDK.
2.  **`const directus = new Directus(import.meta.env.VITE_DIRECTUS_API_URL);`**:
    - Initializes a `Directus` client instance.
    - `import.meta.env.VITE_DIRECTUS_API_URL`: This is how Vite exposes environment variables to your client-side code. This variable will be read from your `.env.development` (or `.env.production`) file.
    - This `directus` instance is now the primary way your `AuthContext` will communicate with your Directus API.
3.  **`useEffect` (`checkAuthStatus` function):**
    - No longer relies on `localStorage.getItem` as the sole check for authentication.
    - `await directus.users.me.read();`: This is the Directus SDK's method to fetch details of the currently authenticated user. If a valid token is in `localStorage`, the SDK will automatically use it.
    - Includes a `try...catch` block to handle cases where the token is invalid or expired, ensuring proper logout in such scenarios.
    - The `handleStorageChange` also now calls `checkAuthStatus()` which makes it more robust.
4.  **`login` function:**
    - `await directus.auth.login({ email, password });`: This is the SDK's method for logging in.
    - **Crucially:** The Directus SDK will automatically handle storing the `access_token` in `localStorage` upon successful login.
    - After `login` is successful, `await directus.users.me.read();` is called again to fetch the complete user object (which includes roles).
5.  **`logout` function:**
    - `await directus.auth.logout();`: This is the SDK's method for logging out. It will invalidate the token on the server and remove it from `localStorage`.
    - `localStorage.removeItem('directus_token');`: Explicitly ensures the token is removed, though the SDK's logout should handle this.

### **Step 3: Update `LoginPage.jsx` (Minimal changes to align with `AuthContext` logic)**

1.  **Open your `1_mainApp/src/pages/Login/Login.jsx` file.**
2.  **Remove the simulated login success alert.**
3.  **Ensure the hardcoded email/password in `Login.jsx` matches the new simulated `test@example.com` from `AuthContext` if you haven't already.**

JavaScript

```
import React, { useState, useEffect } from 'react';
import './Login.css';
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use login function
import { useNavigate } from 'react-router-dom'; // Using useNavigate for programmatic navigation

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth(); // UNCOMMENTED: Use login function from AuthContext
    const navigate = useNavigate(); // UNCOMMENTED: Using useNavigate for programmatic navigation


    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors on new submission

        console.log("Attempting to log in with:", email, password);

        const success = await login(email, password); // Calling the actual login function from AuthContext
        
        if (success) {
            console.log("Login successful! Redirecting to dashboard.");
            navigate('/dashboard'); // Redirect to a protected page on success
        } else {
            setError('Invalid email or password.'); // Display error message from Directus if applicable, or generic
            console.log("Login failed.");
        }
        setLoading(false); // Stop loading regardless of success or failure
    };


  return (
    <div>
        <div className="login_video">
            <video
                width="100%"
                preload="metadata"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src='https://api.wade-usa.com/uploads/Login_Video_b01f36a100.mp4' type="video/mp4" />
                Your browser does not support the video tag. Please update your browser.
            </video>
        </div>

        <form className='form_box' onSubmit={handleSubmit}>
            <h3>Welcome Back</h3>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <label htmlFor='login_input'>Email</label>
            <input id='login_input' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required disabled={loading}></input>
            <label htmlFor='login_password'>Password</label>
            <input type='password' id='login_password' onChange={(e) => setPassword(e.target.value)} value={password} required disabled={loading}></input>
            <button type='submit' disabled={loading} className='login_button_page' >{loading ? 'Logging In...' : 'Login'}</button>
        </form>

        <div className='login_Register'>
            <p>Use credentials from your Directus Users table on the Droplet (e.g., admin@wade-usa.com).</p>
        </div>

    </div>
  )
}

export default Login;
```

### **Step 4: Test Login with your Live Directus Credentials**

Now, when you try to log in, your React app will actually attempt to communicate with your deployed Directus instance.

1.  \*\*Ensure your local React dev server is running:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp
    npm run dev
    ```
    
2.  **Open your browser** to `http://localhost:5173/login`.
    
3.  **Log in using the actual admin credentials for your Directus instance on the Droplet** (e.g., `admin@wade-usa.com` and the strong password you set).
    
4.  **Check your browser's developer console** for any network requests or errors.
    

**Expected Outcome:**

- If successful, you should be redirected to `/dashboard`, and your `DashboardPage` should ideally display `Welcome, admin@wade-usa.com! Your role is: Admin` (or whatever role your admin user has in Directus).
- If there's an issue, you might see "Login failed" and an error message in your browser's console from the Directus SDK.