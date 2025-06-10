**Document Title: Setting Up React Authentication with AuthContext**

**Date:** June 9, 2025

**Project:** wade-usa.com Frontend (`1_mainApp`)

**Goal:** Implement a basic authentication context in your React application to manage user login state. This is the first step towards creating protected routes and integrating with Directus for user management (Pending, Auth, NTK roles).

* * *

### **Overview of `AuthContext`**

The `AuthContext` provides a central way for your React application to store and access information about the currently logged-in user. It uses React's Context API, along with `useState` and `useEffect` hooks, to create a global state that can be shared across multiple components without "prop drilling" (passing props down through many levels of components).

It includes:

- `isAuthenticated`: A boolean (true/false) indicating if a user is logged in.
- `user`: An object holding details about the logged-in user (e.g., ID, email, role).
- `loading`: A boolean indicating if the initial authentication check is still in progress (useful to avoid showing content before knowing the user's status).
- `login`: A function to handle the login process (will eventually call Directus API).
- `logout`: A function to handle the logout process.

* * *

### **Step-by-Step Implementation**

#### **Step 1: Create the `context` Folder and `AuthContext.jsx` File**

This is where your authentication logic will live.

1.  **Open your local terminal** (your R2-D2 machine).
    
2.  \*\*Navigate to your React project's `src` directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp/src
    ```
    
    *(Remember to adjust `1_mainApp` if your React project folder has a different name, e.g., `frontend-app`.)*
    
3.  \*\*Create a new folder named `context`:\*\*Bash
    
    ```
    mkdir context
    ```
    
4.  \*\*Navigate into the newly created `context` folder:\*\*Bash
    
    ```
    cd context
    ```
    
5.  **Create a new file named `AuthContext.jsx`** inside this folder.
    
    - Open your VS Code.
    - In the VS Code Explorer, navigate to `wade-usa.com/1_mainApp/src/context`.
    - Right-click in the explorer panel or use `File > New File` and name it `AuthContext.jsx`.
    - Copy and paste the code from **Code Snippet 1** below into this new file.
6.  **Save the `AuthContext.jsx` file.**
    

* * *

#### **Code Snippet 1: `src/context/AuthContext.jsx`**

JavaScript

```
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Auth Context
// This is the "container" that will hold our authentication information.
// We're giving it a default value of null, which means no context provided yet.
const AuthContext = createContext(null);

// 2. Create the AuthProvider Component
// This component will "provide" the authentication information to all its children.
// Any component inside AuthProvider will be able to access the login state.
export const AuthProvider = ({ children }) => {
  // isAuthenticated: a state variable to track if the user is logged in (true/false)
  // setIsAuthenticated: the function to update that state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // user: a state variable to store user details (like their ID, email, roles from Directus)
  // setUser: the function to update user details
  const [user, setUser] = useState(null);

  // loading: a state variable to indicate if we're still checking auth status (e.g., on app load)
  // setLoading: the function to update the loading state
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the component mounts (when your app first loads).
  // It's used here to check if the user was already logged in (e.g., from a saved token).
  useEffect(() => {
    const checkAuthStatus = async () => {
      // In a real application, you'd check for a saved authentication token (e.g., in localStorage)
      // and then ideally validate it with your Directus API to get current user info.
      const token = localStorage.getItem('directus_token');

      if (token) {
        // For now, we'll just simulate a logged-in state if a dummy token exists.
        // Later, you'll replace this with actual Directus API calls to validate the token
        // and fetch the real user data and roles.
        setIsAuthenticated(true);
        setUser({ id: 1, email: 'testuser@example.com', role: 'Authenticated' }); // Placeholder user
      }
      setLoading(false); // Once check is done, set loading to false
    };

    checkAuthStatus(); // Call the function to check auth status
  }, []); // The empty array means this effect runs only once after the initial render

  // Function to simulate a login action.
  // You will replace this with a real call to your Directus /auth/login endpoint later.
  const login = async (email, password) => {
    // --- Placeholder for Directus Login API Call ---
    // Example:
    // const response = await fetch('https://api.wade-usa.com/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    // if (data.access_token) {
    //   localStorage.setItem('directus_token', data.access_token);
    //   setIsAuthenticated(true);
    //   setUser(data.user); // Assuming Directus returns user data
    //   return true;
    // }
    // return false;

    // Simple simulation for now:
    if (email === 'test@example.com' && password === 'password') {
      setIsAuthenticated(true);
      setUser({ id: 1, email: 'test@example.com', role: 'Authenticated' }); // Set placeholder user
      localStorage.setItem('directus_token', 'dummy-token'); // Store a dummy token
      return true; // Indicate successful login
    }
    return false; // Indicate failed login
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false); // Set authenticated to false
    setUser(null); // Clear user data
    localStorage.removeItem('directus_token'); // Remove any stored token
  };

  // The value prop holds the data and functions that components can access.
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children} {/* Renders all components wrapped by AuthProvider */}
    </AuthContext.Provider>
  );
};

// 3. Create a Custom Hook to easily consume the AuthContext
// This makes it cleaner to use the context in any component.
export const useAuth = () => useContext(AuthContext);
```

* * *

### **Line-by-Line Explanation of `AuthContext.jsx`**

#### **`import React, { createContext, useState, useEffect, useContext } from 'react';`**

- **`import React, { ... } from 'react';`**: This is the standard way to import the React library into your JavaScript file. It's necessary for any file that uses JSX (the HTML-like syntax in React) or React Hooks.
- **`createContext`**: This is a function from React's Context API. It's used to create a "Context object." Think of a Context object as a way to create a global data store for your React application. You can put data into this store, and any component that is "subscribed" to this context can read that data without having to pass it down through props from parent to child to grandchild components.
- **`useState`**: This is a React Hook. Hooks are special functions that let you "hook into" React features from functional components. `useState` specifically allows you to add *state* to a functional component. State is data that can change over time, and when it changes, React knows to re-render the components that use that state.
- **`useEffect`**: This is another React Hook. `useEffect` lets you perform "side effects" in your functional components. Side effects are anything that happens outside the normal flow of rendering (like fetching data from an API, directly manipulating the browser's DOM, setting up event listeners, or checking local storage).
- **`useContext`**: This is a React Hook that works hand-in-hand with `createContext`. Once you have a Context object, `useContext` is the Hook you use *inside* a functional component to access the current value of that context.

#### **`const AuthContext = createContext(null);`**

- **`const AuthContext`**: We declare a constant variable named `AuthContext`. This variable will hold the Context object that we are creating.
- **`createContext(null)`**: We call the `createContext` function. The `null` argument is the *default value* for this context. This default value is used when a component tries to consume the context but is not wrapped by a `Provider` (we'll see the Provider next). For our use case, it's a good initial placeholder.

#### **`export const AuthProvider = ({ children }) => {`**

- **`export const AuthProvider`**: This defines a new React functional component named `AuthProvider`. The `export` keyword means this component can be imported and used in other files in your project (like `main.jsx`).
- **`({ children })`**: This `AuthProvider` component takes one special prop: `children`. In React, the `children` prop automatically refers to whatever content you place *between* the opening and closing tags of your component. For example, if you write `<AuthProvider><App /></AuthProvider>`, then `<App />` would be the `children` prop of `AuthProvider`. This is how `AuthProvider` will "wrap" your entire application and provide context to everything inside it.
- **`=> {`**: This indicates that `AuthProvider` is an arrow function component.

#### **`const [isAuthenticated, setIsAuthenticated] = useState(false);`**

#### **`const [user, setUser] = useState(null);`**

#### **`const [loading, setLoading] = useState(true);`**

- **`const [variableName, setVariableFunction] = useState(initialValue);`**: This is the common pattern for using the `useState` Hook.
    - `variableName`: The name of the state variable (e.g., `isAuthenticated`).
    - `setVariableFunction`: A function that you call to update the `variableName`'s value (e.g., `setIsAuthenticated`). When you call this function, React will re-render the component and any components that use this state.
    - `initialValue`: The starting value for your state variable (e.g., `false` for `isAuthenticated`, `null` for `user`, `true` for `loading`).
- **`isAuthenticated`**: A boolean that will be `true` if the user is currently logged in, `false` otherwise. It starts as `false`.
- **`user`**: An object that will hold data about the logged-in user (like their ID, email, roles from Directus). It starts as `null` because no user is logged in yet.
- **`loading`**: A boolean to indicate if the authentication check (especially on initial app load) is still in progress. It starts as `true` because we need to perform an initial check.

#### **`useEffect(() => { ... }, []);`**

- **`useEffect(() => { ... })`**: This defines a side effect that will run after the component renders.
- **`const checkAuthStatus = async () => { ... };`**: This is an asynchronous function defined inside the `useEffect` callback. It's responsible for checking if the user is already authenticated (e.g., from a previous session).
- **`const token = localStorage.getItem('directus_token');`**: This line attempts to retrieve a stored authentication token from the browser's `localStorage`. In a real application, after a user logs in, the token would be stored here.
- **`if (token) { ... }`**: If a token is found:
    - **`setIsAuthenticated(true);`**: The `isAuthenticated` state is updated to `true`.
    - **`setUser({ id: 1, email: 'testuser@example.com', role: 'Authenticated' });`**: Placeholder user data is set. **In a real app, you would send this `token` to your Directus API (e.g., to an `/users/me` endpoint) to validate it and fetch the actual user's up-to-date profile and roles.**
- **`setLoading(false);`**: Once the `checkAuthStatus` function has completed its check (whether a token was found or not), `loading` is set to `false`, indicating that the initial authentication status is now known.
- **`checkAuthStatus();`**: Calls the function to execute the authentication check.
- **`[]` (empty dependency array)**: This is crucial. An empty array as the second argument to `useEffect` tells React that this effect should **only run once** after the initial render of the component. This is ideal for one-time setup or initialization tasks like checking initial authentication.

#### **`const login = async (email, password) => { ... };`**

- **`const login = async (email, password) => { ... }`**: This defines an asynchronous function named `login` that takes `email` and `password` as arguments. This function will be responsible for handling the user's login attempt.
- **`(Placeholder for Directus Login API Call)`**: This is where you will eventually replace the simulated logic with an actual `fetch` or `axios` call to your Directus login endpoint (e.g., `https://api.wade-usa.com/auth/login`).
- **`if (email === 'test@example.com' && password === 'password') { ... }`**: This is the current **simulation logic**. If the provided `email` and `password` match these specific values, the login is considered successful.
- **`setIsAuthenticated(true); setUser(...)`**: Updates the state to reflect a logged-in user.
- **`localStorage.setItem('dummy_token', 'dummy-token');`**: Simulates storing a token in local storage. In Directus, this would be the actual `access_token` returned by the login endpoint.
- **`return true;` / `return false;`**: The `login` function returns `true` on successful login and `false` on failure, allowing the component that calls `login` to react accordingly.

#### **`const logout = () => { ... };`**

- **`const logout = () => { ... }`**: This defines a function named `logout` that handles the user's logout process.
- **`setIsAuthenticated(false);`**: Sets the authentication status to `false`.
- **`setUser(null);`**: Clears any stored user data.
- **`localStorage.removeItem('directus_token');`**: Removes the authentication token from `localStorage`, effectively logging the user out of the browser session.

#### **`return (`**

#### **`<AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>`**

#### **`{children}`**

#### **`</AuthContext.Provider>`**

#### **`);`**

- **`<AuthContext.Provider>`**: This is the component that makes the `AuthContext` available to its children.
- **`value={{ isAuthenticated, user, loading, login, logout }}`**: This is the most important part of the Provider. The `value` prop is an object that contains *all* the state variables and functions that you want to share with components that consume this context. Any component calling `useAuth()` will receive this exact object.
- **`{children}`**: This renders all the React components that you place inside the `<AuthProvider>` tags in your `main.jsx`. This means all your components will have access to the authentication context.

#### **`export const useAuth = () => useContext(AuthContext);`**

- **`export const useAuth = () => { ... };`**: This defines a custom React Hook. Custom Hooks are a way to reuse stateful logic between components.
- **`useContext(AuthContext)`**: Inside this custom Hook, we simply call the `useContext` Hook and pass it our `AuthContext` object. This Hook then returns the `value` object that the `AuthProvider` is providing.
- **Benefit**: Instead of typing `useContext(AuthContext)` in every component that needs authentication data, you can just type `useAuth()`, making your code cleaner and more readable. For example: `const { isAuthenticated, user, logout } = useAuth();`