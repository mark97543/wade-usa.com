//api.ts
import { createItem, updateItem, readItems, deleteItem } from '@directus/sdk';
import { client } from './directus';

//const BASE_URL = 'https://api.wade-usa.com';


/**
 * Generic Fetcher for Directus Items
 * @param collection - the name of the table
 * @param options - Directus Query parameter (limit, filter ect)
 */

export const getDirectusItems = async <T = any>(collection: string, options: any = {}) => {
    try {
        const result = await client.request(
            readItems(collection as any, {
                ...options,
                params: {
                    _t: Date.now(), // Cache-buster
                }
            })
        );
        
        // FIX: Check the shape of the result
        if (Array.isArray(result)) {
            // Standard response (just the list)
            return { data: result as T[], meta: null };
        } else {
            // Meta response (data + meta)
            // @ts-ignore - Runtime check covers the types here
            return { data: result.data as T[], meta: result.meta };
        }
    } catch (error: any) {
        console.error(`[getDirectusItems] Error:`, error);
        return { data: [] as T[], meta: null };
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

/**
 * Generic Delete item 
 * @param collection 
 * @param id 
 * @returns 
 */

export const deleteDirectusItem = async (collection: string, id: string | number) => {
    try {
        await client.request(deleteItem(collection as any, id));
        return { success: true };
    } catch (error: any) {
        console.error(`[deleteDirectusItem] Error:`, error);
        return { success: false, error: error.message };
    }
};