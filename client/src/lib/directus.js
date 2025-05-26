// src/lib/directus.js
import { createDirectus, rest } from '@directus/sdk';

// Your Directus instance URL.
// For local development, this is the URL where your Directus backend is running.
// Make sure the port matches what you set in your Directus .env file (PORT="5100").
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;


// Create the Directus client instance.
// We are using the REST transport here. You could also use GraphQL if preferred.
const directusClient = createDirectus(DIRECTUS_URL).with(rest());

// Export the initialized client so you can import it in your components/pages.
export default directusClient;
