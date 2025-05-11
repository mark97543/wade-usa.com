// /server/routes/weatherRoutes.js

import express from 'express';
import fetch from 'node-fetch';
import SunCalc from 'suncalc';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const router = express.Router();
const NWS_USER_AGENT = '(wade-usa.com, wade.mark.a@gmail.com)'; // Define User Agent Header Value

/* ---------------------------- Helper Functions ---------------------------- */
// #region Helper Functions
function celsiusToFahrenheit(celsius) {
    if (celsius === null || celsius === undefined) return null;
    return Math.round((celsius * 9 / 5) + 32);
}

function kmhToMph(kph) {
    if (kph === null || kph === undefined) return null;
    return Math.round(kph * 0.621371 * 10) / 10; // Round to 1 decimal place
}
// #endregion Helper Functions


// Define the main endpoint for getting weather
router.get('/', async (req, res) => {
    // get longitude and latitude from query parameters
    const { lat, lon } = req.query;
    //console.log(`Received weather request for Lat: ${lat}, Lon: ${lon}`);

    // Data Validation
    if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
        return res.status(400).json({ message: 'Latitude (lat) and Longitude (lon) query parameters are required and must be numbers' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    try {
        // === Step 1 & 2: Get Point Metadata (URLs, Timezone, Location Name) ===
        const pointsURL = `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
        //console.log(`Workspaceing NWS points data from: ${pointsURL}`);
        const pointsResponse = await fetch(pointsURL, { headers: { 'User-Agent': NWS_USER_AGENT, 'Accept': 'application/geo+json' } });
        if (!pointsResponse.ok) throw new Error(`Failed to fetch NWS point data (${pointsResponse.status})`);
        const pointsData = await pointsResponse.json();

        const locationName = pointsData.properties?.relativeLocation?.properties?.city || "Unknown Location";
        const forecastURL = pointsData.properties?.forecast;
        const hourlyUrl = pointsData.properties?.forecastHourly;
        const stationsURL = pointsData.properties?.observationStations;
        const timezone = pointsData.properties?.timeZone;
        const countyWarningArea = pointsData.properties?.cwa;

        //console.log('NWS URLs & Info:', { forecastURL, hourlyUrl, stationsURL, timezone });
        if (!stationsURL || !timezone || !forecastURL || !hourlyUrl) {
            throw new Error('Required URLs or timezone not found in NWS points response');
        }

        // === Step 3, 4, 5: Fetch and Process Current Conditions ===
        let latestObservation = null;
        let currentConditions = {}; // Initialize empty
        //console.log(`Workspaceing NWS stations data from: ${stationsURL}`);
        const stationsResponse = await fetch(stationsURL, { headers: { 'User-Agent': NWS_USER_AGENT, 'Accept': 'application/geo+json' } });

        if (!stationsResponse.ok) {
            console.warn(`Failed to fetch NWS stations (${stationsResponse.status}).`);
        } else {
            const stationsData = await stationsResponse.json();
            const firstStationUrl = stationsData?.features?.[0]?.id;
            if (firstStationUrl) {
                const latestObservationUrl = `${firstStationUrl}/observations/latest`;
                //console.log(`Workspaceing latest observation from: ${latestObservationUrl}`);
                const observationResponse = await fetch(latestObservationUrl, { headers: { 'User-Agent': NWS_USER_AGENT, 'Accept': 'application/geo+json' } });
                if (!observationResponse.ok) {
                    console.warn(`Failed to fetch latest observation from ${firstStationUrl} (${observationResponse.status}).`);
                } else {
                    const observationData = await observationResponse.json();
                    latestObservation = observationData.properties;
                    //console.log("Raw Observation Data:", JSON.stringify(latestObservation, null, 2));
                }
            } else {
                console.warn("No observation stations found.");
            }
        }
        // Assign processed current conditions
        currentConditions = {
            temperatureF: celsiusToFahrenheit(latestObservation?.temperature?.value),
            conditionsText: latestObservation?.textDescription || "N/A",
            iconUrl: latestObservation?.icon || null,
            windSpeedMph: kmhToMph(latestObservation?.windSpeed?.value),
            humidityPercent: latestObservation?.relativeHumidity?.value !== null && latestObservation?.relativeHumidity?.value !== undefined ? Math.round(latestObservation.relativeHumidity.value) : null,
        };
        //console.log("Processed Current Conditions:", currentConditions);


        // === Step 5a: Fetch and Process Hourly Forecast ===
        let hourlyForecast = [];
        //console.log(`Workspaceing hourly forecast from: ${hourlyUrl}`);
        const hourlyResponse = await fetch(hourlyUrl, { headers: { 'User-Agent': NWS_USER_AGENT, 'Accept': 'application/geo+json' } });
        if (!hourlyResponse.ok) {
            console.warn(`Failed to fetch NWS hourly forecast (${hourlyResponse.status}).`);
        } else {
            const hourlyData = await hourlyResponse.json();
            const periods = hourlyData?.properties?.periods || [];
            //console.log("Raw Hourly Periods Data Sample:", JSON.stringify(periods[0], null, 2));

            hourlyForecast = periods.map(period => {
                const zonedStartTime = toZonedTime(period.startTime, timezone);
                const formattedTime = format(zonedStartTime, 'h a');
                const tempValue = period.temperature;
                const tempUnit = period.temperatureUnit;
                const tempF = (tempUnit === 'F') ? Math.round(tempValue) : celsiusToFahrenheit(tempValue);
                const windSpeedStr = period.windSpeed || "N/A"; 
                // Extract probability of precipitation (rain chance)
                // This is often an object like: { "unitCode": "wmoUnit:percent", "value": 30 } or null
                const probabilityOfPrecipitation = period.probabilityOfPrecipitation?.value;
                const pop = (probabilityOfPrecipitation === null || probabilityOfPrecipitation === undefined) 
                            ? 0 // Default to 0% if null or undefined, or you could use "N/A"
                            : probabilityOfPrecipitation;
                return {
                    time: formattedTime,
                    tempF: tempF,
                    condition: period.shortForecast || "N/A",
                    icon: period.icon || null,
                    windSpeed: windSpeedStr,
                    pop: pop,
                };
            }).slice(0, 12); // This is number of hours to shoew in the hourly forecast
        }
        //console.log("Processed Hourly Forecast:", hourlyForecast);

        // === Step 5b: Fetch and Process Daily Forecast ===
        let dailyForecast = []; // Initialize
        //console.log(`Workspaceing daily forecast from: ${forecastURL}`);
        const dailyResponse = await fetch(forecastURL, { headers: { 'User-Agent': NWS_USER_AGENT, 'Accept': 'application/geo+json' } });

        if (!dailyResponse.ok) {
            console.warn(`Failed to fetch NWS daily forecast (${dailyResponse.status}).`);
        } else {
            const dailyData = await dailyResponse.json();
            const dailyPeriods = dailyData?.properties?.periods || [];
            //console.log("Raw Daily Properties (contains periods):", JSON.stringify(dailyData?.properties, null, 2)); // Log all properties once
            //console.log("Extracted dailyPeriods Length:", dailyPeriods.length);

            // --- Map to intermediate structure (already done in previous code, keep it) ---
            let processedDaily = dailyPeriods.map(period => {
                const tempValue = period.temperature;
                const tempUnit = period.temperatureUnit;
                const tempF = (tempUnit === 'F') ? Math.round(tempValue) : celsiusToFahrenheit(tempValue);
                const startTimeDate = parseISO(period.startTime); // Parse the ISO string
                const zonedStartTime = toZonedTime(startTimeDate, timezone); // Pass the Date object
                const formattedDate = format(zonedStartTime, 'MMM d');
                const popValue = period.probabilityOfPrecipitation?.value;
                const currentPeriodPop = (popValue === null || popValue === undefined) ? 0 : popValue;
                const currentPeriodWindSpeed = period.windSpeed || "N/A";
                return {
                    number: period.number, name: period.name, dateShort: formattedDate,
                    isDaytime: period.isDaytime, tempF: tempF, condition: period.shortForecast || "N/A",
                    icon: period.icon || null, detailed: period.detailedForecast,
                    dateShort: formattedDate,
                    // Store original startTime string if needed for debugging?
                    // startTimeString: period.startTime, // Optional
                    startTime: period.startTime, // Keep original string if needed by consolidation loop below? Or pass zonedStartTime? Let's pass string for now.
                    pop: currentPeriodPop,
                    windSpeed: currentPeriodWindSpeed
                };
            });
            //console.log("Mapped processedDaily Length:", processedDaily.length);

            // --- CORRECTED & SIMPLIFIED Consolidation Logic ---
            const consolidatedDailyForecast = [];
            //console.log("--- Starting Daily Consolidation Loop ---");
            if (Array.isArray(processedDaily)) {
                for (let i = 0; i < processedDaily.length - 1; i += 2) {
                    const period1 = processedDaily[i];
                    const period2 = processedDaily[i + 1];

                    if (period1 && period2) {
                        // Assume period1 is day, period2 is night (or vice-versa if forecast starts at night)
                        const dayPeriod = period1.isDaytime ? period1 : period2;
                        const nightPeriod = period1.isDaytime ? period2 : period1;

                        // Check if we actually got one day and one night
                        if (dayPeriod.isDaytime && !nightPeriod.isDaytime) {
                             //console.log(`Consolidating Day: ${dayPeriod.name}, Night: ${nightPeriod.name}`);
                             const parsedStartTime = parseISO(dayPeriod.startTime); // Parse the ISO string from dayPeriod
                             const zonedStartTimeForFormat = toZonedTime(parsedStartTime, timezone); // Pass the parsed Date object
                             //console.log(`  Date Object for Formatting Day Name:`, zonedStartTimeForFormat); // Keep this log
                             
                             if (isNaN(zonedStartTimeForFormat.getTime())) {
                                console.error(`  ERROR: Invalid date created for formatting day name from startTime: ${dayPeriod.startTime}`);
                                // Assign a default name or skip if date is invalid
                                 consolidatedDailyForecast.push({ dayName: 'Invalid Date', /* ... other data ... */ });
                            } else {
                                consolidatedDailyForecast.push({
                                    dayName: format(zonedStartTimeForFormat, 'EEEE'), // Format the valid, zoned Date object
                                    dateShort: dayPeriod.dateShort,
                                    highF: dayPeriod.tempF,
                                    lowF: nightPeriod.tempF,
                                    icon: dayPeriod.icon,
                                    condition: dayPeriod.condition,
                                    pop:dayPeriod.pop,
                                    windSpeed: dayPeriod.windSpeed
                                });
                                //console.log(`  Pushed data for index ${i}. Array length now: ${consolidatedDailyForecast.length}`);
                            }
                        } else {
                             console.warn(`Skipping consolidation for index ${i}: Periods are not a day/night pair as expected.`);
                        }

                    } else {
                         console.warn(`Skipping consolidation for index ${i}: Missing period data.`);
                    }

                    if (consolidatedDailyForecast.length >= 7) break; // Limit to 7 days
                }
            } else {
                 console.error("ERROR: processedDaily is not an array before consolidation loop.");
            }
            //console.log("--- Finished Daily Consolidation Loop ---");
            dailyForecast = consolidatedDailyForecast; // Assign final result
            // --- --- --- --- --- --- --- --- --- --- ---
        }
        //console.log("Processed Daily Forecast (Consolidated):", dailyForecast);


        // === Step 6: Calculate Sunrise and Sunset ===
        const now = new Date();
        const times = SunCalc.getTimes(now, latitude, longitude);
        const sunriseInZone = toZonedTime(times.sunrise, timezone);
        const sunsetInZone = toZonedTime(times.sunset, timezone);
        const formattedSunrise = format(sunriseInZone, 'h:mm a');
        const formattedSunset = format(sunsetInZone, 'h:mm a');
        const calculatedTimes = { sunrise: formattedSunrise, sunset: formattedSunset };


        // === Step 7: Construct Final Response ===
        res.status(200).json({
            locationName: locationName,
            coordinates: { lat: latitude, lon: longitude },
            currentTimezone: timezone,
            currentConditions: currentConditions,
            calculatedTimes: calculatedTimes,
            hourlyForecast: hourlyForecast,
            dailyForecast: dailyForecast, // Should be populated now
            _debug_nws_urls: { /* ... */ }
        });

    } catch (error) {
        console.error("Error in /weather route:", error);
        res.status(500).json({ message: error.message || 'Error fetching weather data.' });
    }
});

export default router;