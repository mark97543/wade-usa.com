import { createDirectus, rest, authentication } from '@directus/sdk';

// We define the shape of our CMS here.
// As we create collections in Directus, we add them here to get type hints.
interface Schema {
    Global_Theme: {
        site_name: string;
        primary_color: string;
        secondary_color: string;
        site_logo: string; // UUID of the image file
        font_family: string;
        accent_color: string;
        surface_color: string;
        danger_color: string;
        success_color: string;
    };
}

// This pulls the IDs from your .env file automatically
export const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN || '',
  BASIC: import.meta.env.VITE_ROLE_BASIC || '',
  PENDING: import.meta.env.VITE_ROLE_PENDING || '',
  PUBLIC: null // Public is always null in Directus
};

// Connect to your specific API domain
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.wade-usa.com';

// **FINAL FIX:** Ensure the rest extension, with its axios config, is correctly chained
export const client = createDirectus<Schema>(apiUrl)
    .with(rest({ 
        // In the new SDK (using fetch), we use 'credentials' instead of 'withCredentials'
        credentials: 'include'
    })) 
    .with(authentication('cookie', {
        autoRefresh: true, // Handles the silent refresh automatically
    }));

    