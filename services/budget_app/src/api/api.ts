//api.ts
import { createItem, updateItem, readItems } from '@directus/sdk';
import { client } from './directus';

const BASE_URL = 'https://api.wade-usa.com';


/**
 * Generic Fetcher for Directus Items
 * @param collection - the name of the table
 * @param options - Directus Query parameter (limit, filter ect)
 */

export const getDirectusItems = async <T = any>(collection: string, options: any = {}) => {
    try {
        // The SDK's readItems options object is the ONLY argument for client.request
        const result = await client.request(
            readItems(collection as any, {
                ...options,
                // These parameters are serialized into the URL
                params: {
                    _t: Date.now(), // Cache-buster
                }
            })
        );
        
        // If you absolutely need 'no-store' headers, they are usually set 
        // during the initial client creation in directus.ts, not per-request.
        
        return { data: result as T[] };
    } catch (error: any) {
        console.error(`[getDirectusItems] Error:`, error);
        return { data: [] as T[] };
    }
};

/**
 * Generic saver for Directus.
 * @param collection - The name of the collection in Directus.
 * @param data - The object containing the data to save.
 * @param id - (Optional) The ID of the item. If provided (or present in data), it updates; otherwise, it creates.
 * @returns The saved item returned from the API.
 */
export const saveItem = async (collection: string, data: any, id?: string | number) => {
    const targetId = id || data?.id;

    try {
        if (targetId) {
            // --- UPDATE MODE ---
            console.log(`[Saver] Updating ${collection} ID: ${targetId}`);
            // FIX: Cast collection to 'any' to bypass strict Schema checking for this generic function
            return await client.request(updateItem(collection as any, targetId, data));
        } else {
            // --- CREATE MODE ---
            console.log(`[Saver] Creating new item in ${collection}`);
            // FIX: Cast collection to 'any'
            return await client.request(createItem(collection as any, data));
        }
    } catch (error) {
        console.error(`[Saver] Error saving to collection '${collection}':`, error);
        throw error;
    }
};