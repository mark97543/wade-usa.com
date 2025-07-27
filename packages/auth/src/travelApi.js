//Import Travel Information from Directus
import { readItems, createItem, updateItem, uploadFiles, deleteItems } from "@directus/sdk";
import client from "./api.js";

/* ----------------- Fetches all items from trips collection  ---------------- */
export const fetchAllTrips = async ()=>{
    try{
        const trips = await client.request(
            readItems('trips_v2',{
                fields:['*'],
                sort:['start_date']
            })
        );
        //console.log(trips)
        return trips;
    }catch (error){
        console.error("Failed to Fetch Trips (travelAPI.js): ", error)
        return [];
    }
    
}

// /* ----------------- Fetches all items from trips by slug  ---------------- */
export const fetchTripsBySlug = async (slug)=>{
    try{
        const trips = await client.request(
            readItems('trips_v2',{
              fields:['*', { flights: ['*'], trip_gallery_images: ['*'] }],
              filter:{
                slug:slug
                }
            })
        );
        //console.log(trips)
        return trips;
      }catch(error){
        console.error("Failed to Fetch Trip by Slug (travelApi.js): ", error)
        return [];
      }
}                

/**
 * A helper function to upload a file if it exists on the payload and replace it with its ID.
 * @param {object} payload - The data payload.
 * @param {string} fieldName - The name of the file field in the payload.
 */
const handleFileUpload = async (payload, fieldName) => {
  if (payload[fieldName] && payload[fieldName] instanceof File) {
    const formData = new FormData();
    formData.append('file', payload[fieldName]);
    const fileResponse = await client.request(uploadFiles(formData));
    payload[fieldName] = fileResponse.id;
  }
};

/**
 * A helper function to upload multiple files if they exist on the payload and replace them with their IDs.
 * This is for a Directus "Files" (many-to-many) field.
 * @param {object} payload - The data payload.
 * @param {string} fieldName - The name of the file array field in the payload.
 */
const handleMultipleFileUploads = async (payload, fieldName) => {
  if (payload[fieldName] && Array.isArray(payload[fieldName])) {
    const fileIds = await Promise.all(
      payload[fieldName].map(async (fileOrObject) => {
        // If it's a File object, upload it and return the new ID.
        if (fileOrObject instanceof File) {
          const formData = new FormData();
          formData.append('file', fileOrObject);
          const fileResponse = await client.request(uploadFiles(formData));
          return fileResponse.id;
        }
        // If it's an object with an ID (like from a Directus read), return the ID.
        if (typeof fileOrObject === 'object' && fileOrObject !== null && fileOrObject.id) {
          return fileOrObject.id;
        }
        // If it's already a string ID, just return it.
        if (typeof fileOrObject === 'string') {
          return fileOrObject;
        }
        return null;
      })
    );
    // Filter out any nulls and replace the original array with the array of IDs.
    // This is how you update a M2M relationship in Directus - by providing the full array of related primary keys.
    payload[fieldName] = fileIds.filter(id => id !== null);
  }
};

/* ----------------- Creates a new item in the trips_v2 collection ----------------- */
export const createTripV2 = async (tripData) => {
  try {
    const tripDataPayload = { ...tripData };
    await handleFileUpload(tripDataPayload, 'trip_image');
    await handleMultipleFileUploads(tripDataPayload, 'trip_gallery_images');
    const newTrip = await client.request(
      createItem('trips_v2', tripDataPayload)
    );
    return newTrip;
  } catch (error) {
    console.error("Failed to Create Trip (travelApi.js): ", error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};

/* ---------------------------- Make a Slug Feild --------------------------- */

export const makeSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with a single hyphen
    .replace(/-+/g, '-');          // Replace multiple hyphens with a single hyphen
};

/* ----------------- Fetches all slugs from trips_v2 collection ----------------- */
export const fetchAllSlugs = async () => {
  try {
    const slugsResponse = await client.request(
      readItems('trips_v2', {
        fields: ['slug'],
      })
    );
    return slugsResponse.map(item => item.slug);
  } catch (error) {
    console.error("Failed to Fetch Slugs (travelApi.js): ", error);
    return [];
  }
};

/* ---------------------------- Saves and updates --------------------------- */
/**
 * Updates an existing trip, including its relational data.
 * @param {number | string} tripId The primary key of the trip to update.
 * @param {object} tripData The data for fields to create or update.
 * @param {object} deletedItems An object where keys are collection names and values are arrays of IDs to delete.
 * @returns {Promise<object>} The updated trip object.
 */
export const updateTripV2 = async (tripId, tripData, deletedItems) => {
  try {
    // 1. Dynamically delete items from any related collection.
    if (deletedItems) {
      for (const collectionName of Object.keys(deletedItems)) {
        const idsToDelete = deletedItems[collectionName];
        if (idsToDelete && idsToDelete.length > 0) {
          // e.g., deleteItems('flights', [1, 2]), deleteItems('road_trip', [5, 8]), etc.
          await client.request(deleteItems(collectionName, idsToDelete));
        }
      }
    }

    const tripDataPayload = { ...tripData };

    // 2. Handle file uploads for trip_image and banner_picture
    await handleFileUpload(tripDataPayload, 'trip_image');
    await handleFileUpload(tripDataPayload, 'banner_picture');
    await handleMultipleFileUploads(tripDataPayload, 'trip_gallery_images');

    // 3. Update the trip item. Directus handles the deep create/update for relational arrays.
    const updatedTrip = await client.request(updateItem('trips_v2', tripId, tripDataPayload));
    return updatedTrip;
  } catch (error) {
    // Enhanced error logging to see details from Directus
    console.error("Failed to Update Trip (travelApi.js): ", error.errors || error);
    throw error;
  }
};
