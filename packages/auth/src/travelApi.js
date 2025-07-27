//Import Travel Information from Directus
import { readItems, createItem, updateItem, uploadFiles, deleteItems } from "@directus/sdk";
import client from "./api.js";

/* ----------------- Fetches all items from trips collection  ---------------- */
export const fetchAllTrips = async ()=>{
    try{
        const trips = await client.request(
            readItems('trips_v2',{
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
              fields:[
                '*', 
                { flights: ['*'] },
                { hotels: ['*'] },
                { rental_cars: ['*'] },
                { events: ['*'] },
                { roadtrip: ['*'] },
                { trip_images: ['directus_files_id.*'] }
              ],
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
 * @param {'create' | 'update'} [operation='update'] - The type of operation.
 */
const handleMultipleFileUploads = async (payload, fieldName, operation = 'update') => {
  if (payload[fieldName] && Array.isArray(payload[fieldName])) {
    const uploadedFileIds = await Promise.all(
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

    const finalIds = uploadedFileIds.filter(id => id !== null);

    if (operation === 'create') {
      // For 'create', we need to use the deep/relational create syntax.
      payload[fieldName] = {
        create: finalIds.map(id => ({ directus_files_id: id })),
      };
    } else {
      // For 'update', providing the full array of related primary keys acts as a "replace" operation.
      payload[fieldName] = finalIds;
    }
  }
};

/**
 * Uploads an image file for use within the Quill editor.
 * @param {File} file The image file to upload.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export const uploadEditorImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const fileResponse = await client.request(uploadFiles(formData));
    return `https://api.wade-usa.com/assets/${fileResponse.id}`;
  } catch (error) {
    console.error("Failed to upload image for editor:", error);
    throw error;
  }
};

/* ----------------- Creates a new item in the trips_v2 collection ----------------- */
export const createTripV2 = async (tripData) => {
  try {
    const tripDataPayload = { ...tripData };
    await handleFileUpload(tripDataPayload, 'trip_image');
    await handleMultipleFileUploads(tripDataPayload, 'trip_images', 'create');
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
          await client.request(deleteItems(collectionName, idsToDelete));
        }
      }
    }

    // 2. Separate the gallery images from the main payload to handle them in a second step.
    const { trip_images, ...mainTripData } = tripData;
    const tripDataPayload = { ...mainTripData };

    // 3. Handle single file uploads for the main payload (trip_image, banner_picture).
    await handleFileUpload(tripDataPayload, 'trip_image');
    await handleFileUpload(tripDataPayload, 'banner_picture');

    // 4. Update the main trip item with all data EXCEPT the gallery.
    let updatedTrip = await client.request(updateItem('trips_v2', tripId, tripDataPayload));

    // 5. Now, handle the gallery images in a separate, dedicated update.
    if (trip_images && trip_images.current) {
      const { current, initial } = trip_images;

      // Process the 'current' array to get a final list of all file IDs.
      const finalFileIds = await Promise.all(
        current.map(async (fileOrObject) => {
          if (fileOrObject instanceof File) {
            const formData = new FormData();
            formData.append('file', fileOrObject);
            const fileResponse = await client.request(uploadFiles(formData));
            return fileResponse.id;
          }
          return fileOrObject?.id || fileOrObject;
        })
      );
      const finalFileIdSet = new Set(finalFileIds.filter(Boolean));

      // Map initial file IDs to their junction table primary keys.
      const initialFileIdToJunctionIdMap = new Map();
      initial.forEach(item => {
        if (item.directus_files_id) {
          initialFileIdToJunctionIdMap.set(item.directus_files_id.id, item.id);
        }
      });
      const initialFileIdSet = new Set(initialFileIdToJunctionIdMap.keys());

      // Calculate the differences to create an explicit payload.
      const filesToCreate = [...finalFileIdSet].filter(id => !initialFileIdSet.has(id));
      const filesToDelete = [...initialFileIdSet].filter(id => !finalFileIdSet.has(id));
      const junctionIdsToDelete = filesToDelete.map(fileId => initialFileIdToJunctionIdMap.get(fileId)).filter(Boolean);

      const galleryPayload = {
        trip_images: {
          create: filesToCreate.map(fileId => ({ directus_files_id: fileId })),
          delete: junctionIdsToDelete,
        }
      };

      if (galleryPayload.trip_images.create.length > 0 || galleryPayload.trip_images.delete.length > 0) {
        console.log("Attempting to link/unlink images with explicit payload:", JSON.stringify(galleryPayload, null, 2));
        updatedTrip = await client.request(updateItem('trips_v2', tripId, galleryPayload));
      }
    }

    return updatedTrip;
  } catch (error) {
    // Enhanced error logging to see details from Directus
    console.error("Failed to Update Trip (travelApi.js): ", error.errors || error);
    throw error;
  }
};
