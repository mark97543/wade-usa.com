//Import Travel Information from Directus

import { readItems } from "@directus/sdk";
import client from "./api.js";

/* ----------------- Fetches all items from trips collection ---------------- */
export const fetchAllTrips = async ()=>{
    try{
        const trips = await client.request(
            readItems('trips',{
                fields:['*'],
                sort:['start_date']
            })
        );
        console.log(trips)
        return trips;
    }catch (error){
        console.error("Failed to Fetch Trips (travelAPI.js): ", error)
        return [];
    }
    
}