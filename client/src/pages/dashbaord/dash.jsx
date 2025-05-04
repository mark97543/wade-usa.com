// /client/src/pages/dashbaord/dash.jsx

import React from "react";

import { useAuth } from '../../context/AuthContext'; // Import useAuth

const Dashboard = () =>{

      // Get the SAME logout function from context
        const { logout } = useAuth();

        // Temporary handler for the test button
    const handleTempLogout = () => {
        
        console.log("Temporary logout button clicked in Dashboard!");
        logout(); // <--- Call the exact same logout function from context
    };

    return(
        <>
        
            <h1>Dashboard Placeholder</h1>

            <button onClick={handleTempLogout} style={{ border: '2px solid red', padding: '5px', margin: '10px' }}>
                Temporary Logout Test (from Dashboard)
            </button>
        
        </>
    )


}

export default Dashboard;