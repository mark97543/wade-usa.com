//Import Travel Information from Directus
import { readItems } from "@directus/sdk";
import client from "./api.js";

/* ----------------- Fetches all items from trips collection  ---------------- */
export const fetchAllTrips = async ()=>{
    try{
        const trips = await client.request(
            readItems('trips',{
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

/* ----------------- Fetches all items from trips by slug  ---------------- */
export const fetchTripBySlug = async (slug) => {
  try {
    // --- Step 1: Fetch the main trip and the junction table data ---
    const tripResponse = await client.request(
      readItems('trips', {
        filter: {
          slug: {
            _eq: slug,
          },
        },
        fields: ['*', { trip_day_detail: ['*'] }],
        limit: 1,
      })
    );

    // If no trip is found, return null
    if (!tripResponse || tripResponse.length === 0) {
      return null;
    }

    const trip = tripResponse[0];

    // --- Step 2: Check if there are related day details to fetch ---
    if (trip.trip_day_detail && trip.trip_day_detail.length > 0) {
      
      // --- Step 3: Extract the IDs from the junction data ---
      const dayIds = trip.trip_day_detail.map(item => item.trip_days_id);

      // --- Step 4: Fetch all the full day details using their IDs ---
      const daysData = await client.request(
        readItems('trip_days', { // Assuming your collection is named 'trip_days'
          filter: {
            id: {
              _in: dayIds, // _in fetches all items where the id is in this array
            },
          },
          fields: ['*'], // Get all fields from the trip_days items
        })
      );

      // --- Step 5: Replace the simple junction data with the full data ---
      trip.trip_day_detail = daysData;
    }

    return trip; // Return the complete, merged trip object

  } catch (error) {
    console.error("Failed to fetch trip by slug:", error);
    return null;
  }
};