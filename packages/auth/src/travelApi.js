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
                { carousel_images: ['id', 'directus_files_id.*'] }
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
 */
const handleMultipleFileUploads = async (payload, fieldName) => {
  if (payload[fieldName] && Array.isArray(payload[fieldName])) {
    const uploadedFileIds = await Promise.all(
      payload[fieldName].map(async (fileOrObject) => {
        if (fileOrObject instanceof File) {
          const formData = new FormData();
          formData.append('file', fileOrObject);
          const fileResponse = await client.request(uploadFiles(formData));
          return fileResponse.id;
        }
        if (typeof fileOrObject === 'object' && fileOrObject !== null && fileOrObject.id) {
          return fileOrObject.id;
        }
        if (typeof fileOrObject === 'string') {
          return fileOrObject;
        }
        return null;
      })
    );

    // For both create and update, Directus can accept a simple array of foreign keys for a M2M relationship.
    // This will replace the existing set of related items with the new set.
    payload[fieldName] = uploadedFileIds.filter(id => id !== null);
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
    await handleMultipleFileUploads(tripDataPayload, 'carousel_images');
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

    // Separate the carousel images from the main payload to handle them in a second step.
    const { carousel_images, ...mainTripData } = tripData;
    const tripDataPayload = { ...mainTripData };

    // Handle single file uploads for the main payload (trip_image, banner_picture).
    await handleFileUpload(tripDataPayload, 'trip_image');
    await handleFileUpload(tripDataPayload, 'banner_picture');

    // Update the main trip item with all data EXCEPT the carousel images.
    let updatedTrip = await client.request(updateItem('trips_v2', tripId, tripDataPayload));

    // Now, handle the carousel images in a separate, dedicated update.
    if (carousel_images && carousel_images.current) {
      const { current, initial } = carousel_images;

      // Process the 'current' array to get a final list of all file IDs, uploading new files.
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

      // Map initial file IDs to their junction table primary keys for deletion.
      const initialFileIdToJunctionIdMap = new Map();
      (initial || []).forEach(item => {
        if (item.directus_files_id) {
          initialFileIdToJunctionIdMap.set(item.directus_files_id.id, item.id);
        }
      });
      const initialFileIdSet = new Set(initialFileIdToJunctionIdMap.keys());

      // Calculate the differences to create an explicit payload.
      const filesToCreate = [...finalFileIdSet].filter(id => !initialFileIdSet.has(id));
      const junctionIdsToDelete = [...initialFileIdSet].filter(id => !finalFileIdSet.has(id)).map(fileId => initialFileIdToJunctionIdMap.get(fileId)).filter(Boolean);

      const carouselPayload = {
        carousel_images: {
          create: filesToCreate.map(fileId => ({ directus_files_id: fileId })),
          delete: junctionIdsToDelete,
        }
      };

      // Only send the update if there are actual changes to be made.
      if (carouselPayload.carousel_images.create.length > 0 || carouselPayload.carousel_images.delete.length > 0) {
        updatedTrip = await client.request(updateItem('trips_v2', tripId, carouselPayload));
      }
    }

    return updatedTrip;
  } catch (error) {
    // Enhanced error logging to see details from Directus
    console.error("Failed to Update Trip (travelApi.js): ", error.errors || error);
    throw error;
  }
};
