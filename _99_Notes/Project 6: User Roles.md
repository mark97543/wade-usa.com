### **Project 6: User Roles**

**Mission:** Check the user's current role when they log in and restrict access to certain sites (pages) based on that role.

* * *

**6.1. Role-Based Access Control (RBAC) Implementation** To control access to pages, the `ProtectedRoute` component was enhanced to accept an `allowedRoles` prop. This prop is an array of strings representing the role names permitted to access a specific route. The component checks the logged-in user's role name against this list.

**6.2. Handling "Pending" and "Forbidden" States** The `ProtectedRoute` logic was updated to handle multiple user states for a better user experience:

- **Pending Users:** If a logged-in user has the role of "Pending", they are automatically redirected to a dedicated `/pending-approval` page, preventing them from accessing any other protected content.
    
- **Forbidden Access:** If an authenticated, non-pending user attempts to access a route their role is not authorized for (e.g., a "Basic" user trying to access an "Administrator" page), they are now shown a custom "Forbidden" page instead of a blank screen.
    

**6.3. Troubleshooting and Resolution**

- **Issue: Logout Failing**
    
    - **Cause:** The initial logout function was not correctly sending the `refresh_token` to the Directus API, resulting in a `400 Bad Request` error. The client-side session would clear, but the server-side session remained active.
        
    - **Solution:** The `logout` function in `AuthContext.jsx` was rewritten to correctly retrieve the `refresh_token` from `localStorage` and pass it to the `apiLogout` function from the Directus SDK. This ensures the session is terminated on both the client and the server.
        
- **Issue: Role Data Not Returned on Login**
    
    - **Cause:** After logging in, the API was only returning the user's ID (`{id: "..."}`) and not the full user object with the necessary `role` information. This was caused by the "Pending" role lacking permission to read from the `directus_users` and `directus_roles` collections.
        
    - **Solution:** The permissions for the "Pending" role were updated in the Directus admin panel.
        
        1.  **App Access:** "App Access" was enabled for the role, granting permission to log in.
            
        2.  **Self-Read Permission:** Custom read permissions were granted on the `directus_users` collection with the rule `id Equals $CURRENT_USER`, allowing users to read their own data.
            
        3.  **Field & Relational Permissions:** "Field Permissions" were enabled for the `role` field, and "Read" access was granted to the `directus_roles` collection, allowing the API to include the full, nested role object in the login response.
            

**6.4. Final Code**

- **Code Modified:** `packages/auth/src/ProtectedRoute.jsx` (Final Version)
    
    JavaScript
    
    ```
    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from './AuthContext.jsx';
    import Forbbiden from '@wade-usa/feature-home/src/forbidden/Forbbiden.jsx';
    
    export const ProtectedRoute = ({ children, allowedRoles }) => {
        const { user, loading } = useAuth();
    
        if (loading) {
            return <div>Checking authentication...</div>;
        }
    
        if (!user) {
            return <Navigate to="/login" replace />;
        }
    
        if (user.role && user.role.name === 'Pending') {
            return <Navigate to="/pending-approval" replace />;
        }
    
        if (allowedRoles && !allowedRoles.includes(user.role.name)) {
            return <Forbbiden />;
        }
    
        return children;
    };
    ```