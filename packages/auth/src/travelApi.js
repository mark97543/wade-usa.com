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
    const response = await client.request(
      readItems('trips', {
        filter: {
          slug: {
            _eq: slug, // _eq means "equals"
          },
        },
        limit: 1, 
      })
    );

    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error("Failed to fetch trip by slug:", error);
    return null;
  }
};