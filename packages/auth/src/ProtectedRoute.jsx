import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx'; // Use relative path inside the package

export const ProtectedRoute = ({children})=>{
    const {user, loading} = useAuth();

    // While we're checking for a user, we can show a loading indicator
    if(loading){
        return <div>Checking authentication ...</div> //TODO: LOADING TO ANIMATE
    }

    if(!user){
        //If no User, redirect then to the login Page
        return <Navigate to='/login' replace />
    }

    //if there is a user, render the page they were trying to access
    return children
}