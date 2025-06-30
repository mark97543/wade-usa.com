### **Project 5: User Registration**

**Mission:** Implement and test the user registration flow, allowing new users to create an account.

* * *

**5.1. Backend Configuration (Directus)** To allow new users to register, two critical settings were configured in the Directus admin panel at `https://api.wade-usa.com`.

- **Public Registration Enabled:** In **Settings > User Registration**, the "Enable Public Registration" toggle was turned on. This opens the necessary API endpoint for the registration form to use.
    
- **Default Role Set:** The "Default Role" in the User Registration settings was set to the "Pending" role. This ensures that even though our final code specifies the role, there is a server-side default in place.
    

**5.2. Frontend Implementation** The registration form at `packages/features/home/src/Registration/Registration.jsx` was updated to use the central `useAuth` hook, ensuring all authentication logic is handled by `AuthContext.jsx`. The `register` function in the context now handles the API call, user state updates, automatic login after registration, and error management.

**5.3. Troubleshooting Registration**

- **Issue: `403 Forbidden` Error**
    
    - **Cause:** The initial attempt to register a user was blocked by Directus because, by default, the public role does not have permission to create new users.
        
    - **Solution:** The issue was resolved by enabling "Public Registration" in the Directus project settings, which explicitly allows the `createUser` API call to succeed.
        
- **Issue: New Users Not Assigned "Pending" Role**
    
    - **Cause:** The initial version of the `register` function used a standard SDK helper that did not allow specifying a role ID, causing new users to be assigned the server's default role instead of our desired "Pending" role.
        
    - **Solution:** The `register` function in `AuthContext.jsx` was modified to use the more specific `createUser` function from the Directus SDK. This allowed us to include the exact role ID (`54cdf754-88ef-48b4-b847-88e1c7e52aa9`) in the body of the user creation request, ensuring all new users are correctly assigned the "Pending" status.
        

**5.4. Final Code**

- **Code Added:** `packages/auth/src/AuthContext.jsx` (final `register` function)
    
    JavaScript
    
    ```
    // --- CORRECTED REGISTER FUNCTION ---
    const register = async (email, password) => {
      setAuthError(null);
      try {
        // Use the 'createUser' function from the SDK, passing an object
        // with all the user details, including the specific role ID.
        await client.request(createUser({
            email: email,
            password: password,
            role: '54cdf754-88ef-48b4-b847-88e1c7e52aa9', // The correct "Pending" role ID
        }));
    
        // After successful registration, automatically log the user in.
        await login(email, password);
        return true;
      } catch (error) {
        console.error('Registration failed:', error);
        const errorMessage = error.errors?.[0]?.message || 'This email may already be registered.';
        setAuthError(errorMessage);
        throw new Error('Registration failed.');
      }
    };
    ```