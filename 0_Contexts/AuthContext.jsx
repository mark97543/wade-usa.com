import React, {createContext, useState, useEffect, useContext} from "react";

    //1. Create the Auth Context
    const AuthContext = createContext();


export const AuthProvider = ({ children }) => { // <-- Correctly defined as a functional component



    //2. Creat the Auth Provider Component
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //user state to store user information
    const [user, setUser] = useState(null);

    //loading state to manage loading state
    const [loading, setLoading] = useState(true);

    //useEffect to check authentication status on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('directus_token'); // Example token retrieval

            if (token) {
                setIsAuthenticated(true);
                // Important: Match the simulated user email/password in login.
                // It should be 'test@example.com', not 'testuser@example.com' for consistency.
                setUser({ id: 1, email: 'test@example.com', role: 'Authenticated' });
            } else { // Explicitly set to false if no token
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false); // Set loading to false AFTER the check is complete
        };

        checkAuthStatus(); // <--- Call the function ONCE here

        // Listener for 'storage' events to synchronize state across tabs/windows on the same domain.
        const handleStorageChange = (event) => {
            if (event.key === 'directus_token') {
                if (event.newValue === null) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else if (event.newValue) {
                    setIsAuthenticated(true);
                    // Match the simulated user email/password in login.
                    setUser({ id: 1, email: 'test@example.com', role: 'Authenticated' });
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function: remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // Function to simulate a login action.
    // You will replace this with a real call to your Directus /auth/login endpoint later.
    const login = async (email, password) => {
        if(email === 'testuser@example.com' && password === 'password') {
            // This is a placeholder for actual authentication logic.

            // Simulate Successful login
            setIsAuthenticated(true);
            setUser({ id: 1, email: 'testuser@example.com', role: 'Authenticated' });
            localStorage.setItem('directus_token', 'dummy_token'); // Save a dummy token
            console.log("Login successful! User:")
            return true; // Indicate success
        } else {
            // Simulate Failed login
            return false; // Indicate failure
        }
    };

    // Function to simulate a logout action.
    const logout = () =>{
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('directus_token'); // Remove the token on logout
    }

    //The Value prop holds the data and functions that components can access
    return(
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children} {/* Children components will have access to the AuthContext */}
        </AuthContext.Provider>
    );
}; // <-- Closing brace for the AuthProvider component

//3. Create a custom hook to use the AuthContext
export const useAuth = ()=>useContext(AuthContext);