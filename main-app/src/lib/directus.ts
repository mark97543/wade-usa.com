/**
 * 🔗 SERVICE: Directus Client
 * This is the central connection point for our CMS.
 * /src/services/directus.ts
 */

import { createDirectus, rest, authentication } from "@directus/sdk";

//Import URL
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;

if(!DIRECTUS_URL){
    console.error("VITE_DIRECTUS_URL is missing in .env file!");
}

//Custom storage wrapper 
const customStorage = {
    // Directus now expects get() to take no arguments
    get: async () => {
        const data = localStorage.getItem('directus_auth_data');
        return data ? JSON.parse(data) : null;
    },
    // Directus now expects set() to take the data object as the only argument
    set: async (value: any) => {
        if (value) {
            localStorage.setItem('directus_auth_data', JSON.stringify(value));
        } else {
            localStorage.removeItem('directus_auth_data');
        }
    }
};

//Iniitialize client with Rest (for data) and Auth (for login)
const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(authentication('json', {
        storage: customStorage as any // 'as any' bypasses the strict interface check
    }));

export default client;