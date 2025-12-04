import { createDirectus, rest, authentication } from '@directus/sdk';

// Define the shape of your global theme and other collections here
interface Schema {
    Global_Theme: {
        site_name: string;
        primary_color: string;
        secondary_color: string;
        site_logo: string; 
        font_family: string;
        accent_color: string;
        surface_color: string;
        danger_color: string;
        success_color: string;
    };
}

// Environment Variables
export const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN || '',
  BASIC: import.meta.env.VITE_ROLE_BASIC || '',
  PENDING: import.meta.env.VITE_ROLE_PENDING || '',
  PUBLIC: null
};

const apiUrl = import.meta.env.VITE_API_URL || 'https://api.wade-usa.com';

// 1. Create the Client
export const client = createDirectus<Schema>(apiUrl)
    .with(rest({ 
        // CRITICAL: This tells the browser to send the HttpOnly cookie with every request
        credentials: 'include' 
    })) 
    .with(authentication('cookie', { 
        // CRITICAL: This ensures the SDK silently renews the token when it expires
        autoRefresh: true 
    }));