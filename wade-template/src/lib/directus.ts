// /root/projects/wade-template/src/lib/directus.ts

/**
 * Directus Client Instance
 * ------------------------
 * FIXED: Added a "Translator" for LocalStorage to satisfy TypeScript.
 */

import { createDirectus, rest, authentication } from '@directus/sdk';

const BACKEND_URL = 'https://api.wade-usa.com';

// We use default memory storage (no config needed).
// We will handle LocalStorage manually in our Auth Service.
export const client = createDirectus(BACKEND_URL)
  .with(authentication()) 
  .with(rest());