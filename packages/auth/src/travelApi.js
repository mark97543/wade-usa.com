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
              fields:['*', { flights: ['*'] }],
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

/* ----------------- Creates a new item in the trips_v2 collection ----------------- */
export const createTripV2 = async (tripData) => {
  try {
    const tripDataPayload = { ...tripData };

    // Check if there's an image to upload and it's a File object
    if (tripDataPayload.trip_image && tripDataPayload.trip_image instanceof File) {
      const formData = new FormData();
      formData.append('file', tripDataPayload.trip_image);

      // 1. Upload the file and get its ID
      const fileResponse = await client.request(uploadFiles(formData));

      // 2. Replace the file object with the file ID for the trip creation
      tripDataPayload.trip_image = fileResponse.id;
    }

    // 3. Create the trip item with the file ID
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
 * @param {object} tripData The data to update.
 * @returns {Promise<object>} The updated trip object.
 */
export const updateTripV2 = async (tripId, tripData, deletedFlightIds) => {
  try {
    // 1. Delete any flights that were removed from the list.
    if (deletedFlightIds && deletedFlightIds.length > 0) {
      // This requires the user to have delete permissions on the 'flights' collection.
      await client.request(deleteItems('flights', deletedFlightIds));
    }

    const tripDataPayload = { ...tripData };

    // 2. Handle file upload if a new image is provided (it will be a File object)
    if (tripDataPayload.trip_image && tripDataPayload.trip_image instanceof File) {
      const formData = new FormData();
      formData.append('file', tripDataPayload.trip_image);
      const fileResponse = await client.request(uploadFiles(formData));
      // Replace the file object with the new file ID
      tripDataPayload.trip_image = fileResponse.id;
    }

    // 3. Update the trip item. Directus handles the deep create/update for the O2M flights array.
    const updatedTrip = await client.request(updateItem('trips_v2', tripId, tripDataPayload));
    return updatedTrip;
  } catch (error) {
    console.error("Failed to Update Trip (travelApi.js): ", error.errors || error);
    throw error;
  }
};