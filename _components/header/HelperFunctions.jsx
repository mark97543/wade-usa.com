import React from "react";
import Dropdown from "./HeaderComponents/DropdownMenu/Dropdown";


const appName = import.meta.env.VITE_APP_NAME; // Read the environment variable once


/**
 * Generates the correct URL for the logo based on authentication status and current app.
 * @param {boolean} isAuthenticated - Whether the user is currently authenticated.
 * @returns {string} The URL for the logo link.
*/
export const getLogoLinkHref = (isAuthenticated) => {
    const isMainApp = appName === 'home';
    if (isAuthenticated) {
        return isMainApp ? '/docker' : 'https://wade-usa.com/docker'
    } else {
        // Unauthenticated users go to home. If in travel, link to main app home.
        return isMainApp ? '/' : 'https://wade-usa.com/'; // Absolute URL for cross-app navigation
    }
}

/**
 * Generates a dropdown menu for travel-related links.
 * @returns {JSX.Element} A React Dropdown component containing travel links.
 */
export const MainTravelLink = () => {
    // Determine if the current app is the 'travel' app
    const isTravelApp = appName === "travel";

    // You'll need to import your Dropdown component, assuming its path
    // For example: import Dropdown from '../../_components/Dropdown'; // Adjust path based on your structure
    // Or if Dropdown is also in 0_Contexts: import Dropdown from './Dropdown';

    return (
        // Use the Dropdown component here
        <Dropdown title="Travel"> {/* The title of your dropdown */}
            {/* These are the items that will appear when the dropdown is open */}
            <a className="travel_list_dropdown_item" href={isTravelApp ? '/' : 'https://travel.wade-usa.com/'}>
                Travel Planner 
            </a>
            <a className="travel_list_dropdown_item">
                My Roadbooks (NTB)
            </a>
        </Dropdown>
    );
};