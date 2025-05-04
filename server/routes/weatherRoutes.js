// /server/routes/weatherRoutes.js

import express from 'express'

const router = express.Router();

// Define the main endpoint for getting weather
// We'll mount this under /api/weather in server.js, so this handles GET /api/weather?lat=XX&lon=YY
router.get('/', async(req, res)=>{
    //get longitude and latitude from query parameters
    const {lat, lon}=req.query;

    console.log(`Recvied weather request for Lat: ${lat}, Lon: ${lon}`);

    //Data Valication to ensure lon and lat are numbers and are provided
    if(!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))){
        return res.status(400).json({message: 'Latitude (lat) and Longitude (lon) query parameters are required and must be numbers'})
    }

    // --- Placeholder for NWS API Logic ---
    // TODO:
    // 1. Make request to NWS API /points/{lat},{lon}
    // 2. Get forecast/observation URLs from the response
    // 3. Make requests to those URLs
    // 4. Process the data (handle units, select needed fields)
    // 5. Send back the formatted data

    try{
        //Placeholder response for now
        res.status(200).json({
            message: `Weather data placeholder for ${lat}, ${lon}`,
            // Eventually, replace this with actual processed NWS data
            currentConditions: {},
            hourlyForecast: [],
            dailyForecast: []
        })
    }catch(error){
        console.error("Error in /weather route: ", error)
        res.status(500).json({message: 'Error Fetching Weather Data'})
    }
})

export default router;