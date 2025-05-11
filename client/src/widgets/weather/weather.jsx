// /client/src/widgets/weather/weather.jsx

import { useState, useEffect } from 'react';
import React from "react";
import './weather.css'
import { toZonedTime } from 'date-fns-tz';
import SunCalc from 'suncalc';
import { format, parseISO, addDays } from 'date-fns';

//#region Weather Icons

    import AmDayClear from '../../assets/icons/weather/animated/day.svg?react';
    import AmNightClear from '../../assets/icons/weather/animated/night.svg?react';
    import AmCloudyDay1 from '../../assets/icons/weather/animated/cloudy-day-1.svg?react';
    import AmCloudyNight1 from '../../assets/icons/weather/animated/cloudy-night-1.svg?react';
    import AmCloudyDay2 from '../../assets/icons/weather/animated/cloudy-day-2.svg?react';
    import AmCloudyNight2 from '../../assets/icons/weather/animated/cloudy-night-2.svg?react';
    import AmCloudyDay3 from '../../assets/icons/weather/animated/cloudy-day-3.svg?react';
    import AmCloudyNight3 from '../../assets/icons/weather/animated/cloudy-night-3.svg?react';
    // import AmCloudy from '../../assets/icons/weather/animated/cloudy.svg?react'; // You said you don't have this one
    // import AmFog from '../../assets/icons/weather/animated/fog.svg?react'; // You said you don't have this one

    import AmRainy1 from '../../assets/icons/weather/animated/rainy-1.svg?react';
    import AmRainy3 from '../../assets/icons/weather/animated/rainy-3.svg?react';
    import AmRainy5 from '../../assets/icons/weather/animated/rainy-5.svg?react';
    import AmRainy6 from '../../assets/icons/weather/animated/rainy-6.svg?react';
    // import AmRainy7 from '../../assets/icons/weather/animated/rainy-7.svg?react'; // Make sure you have this if used in mapping

    import AmSnowy1 from '../../assets/icons/weather/animated/snowy-1.svg?react';
    // import AmSnowy3 from '../../assets/icons/weather/animated/snowy-3.svg?react'; // Make sure you have this if used
    import AmSnowy5 from '../../assets/icons/weather/animated/snowy-5.svg?react';
    import AmSnowy6 from '../../assets/icons/weather/animated/snowy-6.svg?react';
    import AmThunder from '../../assets/icons/weather/animated/thunder.svg?react';

    // If you have AmSleet.svg or AmWind.svg, import them similarly:
    // import AmSleet from '../../assets/icons/weather/animated/sleet.svg?react';
    // import AmWind from '../../assets/icons/weather/animated/wind.svg?react';

//#endregion


//#region  Helper to get details from NWS icon URL (same as before)

export const getNwsIconDetails = (nwsIconUrlString) => {
    // ... (same logic as previous example to parse NWS URL)
    if (!nwsIconUrlString || typeof nwsIconUrlString !== 'string') {
        return { timeOfDay: 'day', conditionCode: 'unknown', probability: null };
    }
    try {
        const url = new URL(nwsIconUrlString);
        const pathParts = url.pathname.split('/');
        const timeOfDay = pathParts[pathParts.length - 2]?.toLowerCase() || 'day';
        const conditionSegment = pathParts[pathParts.length - 1];
        let mainCondition = conditionSegment;
        let probability = null;
        const conditionMatch = conditionSegment.match(/^([a-zA-Z_]+)(?:,(\d+))?/);
        if (conditionMatch) {
            mainCondition = conditionMatch[1];
            if (conditionMatch[2]) probability = parseInt(conditionMatch[2], 10);
        }
        return { timeOfDay, conditionCode: mainCondition.toLowerCase(), probability };
    } catch (e) {
        console.error("Error parsing NWS icon URL:", nwsIconUrlString, e);
        return { timeOfDay: 'day', conditionCode: 'unknown', probability: null };
    }
};

//#endregion

//#region Mapping function returns the amCharts React Component or null
export const mapNwsToAmChartsIconComponent = (nwsShortForecast, nwsIconUrl) => {
    const details = getNwsIconDetails(nwsIconUrl);
    const forecastLower = (typeof nwsShortForecast === 'string') 
                            ? nwsShortForecast.toLowerCase() 
                            : ""; 

    

    // 1. Specific Hazardous Conditions (Thunderstorms, Hurricanes etc.)
    if (details.conditionCode.includes('tsra') || forecastLower.includes('thunder')) return AmThunder;
    // if (forecastLower.includes('hurricane')) return AmHurricane; // If you have AmHurricane

    // 2. Precipitation Types (Rain, Snow, Sleet, Freezing Rain)
    // Prioritize more specific precipitation before general "rain" or "snow"
    if (forecastLower.includes('freezing rain') || details.conditionCode.includes('fzra') || forecastLower.includes('freezing drizzle')) {
        return AmRainy1; // Or a specific freezing rain amCharts icon if available (often looks like rain with ice)
    }
    if (forecastLower.includes('sleet') || details.conditionCode.includes('ip') || details.conditionCode.includes('ice_pellets')) {
        // return AmSleet; // If you have a distinct AmSleet component
        return AmSnowy1; // Fallback to light snow/flurries if no specific sleet icon
    }
    if (forecastLower.includes('rain') || forecastLower.includes('showers') || details.conditionCode.includes('rain')) {
        if (forecastLower.includes('heavy')) return AmRainy6; // Or AmRainy7
        if (forecastLower.includes('moderate')) return AmRainy5;
        if (forecastLower.includes('light') || forecastLower.includes('slight') || (details.probability && details.probability <= 40)) return AmRainy3; // or AmRainy1 for drizzle/very light
        return AmRainy5; // Default for general "rain" or "showers"
    }
    if (forecastLower.includes('snow') || details.conditionCode.includes('sn') || details.conditionCode.includes('snowshow')) { // NWS 'sn' or 'snowshow'
        if (forecastLower.includes('heavy')) return AmSnowy6;
        if (forecastLower.includes('moderate')) return AmSnowy5;
        if (forecastLower.includes('light') || forecastLower.includes('slight') || forecastLower.includes('flurries')) return AmSnowy1; // or AmSnowy3
        return AmSnowy5; // Default for general "snow"
    }

    // 3. Atmospheric Obscurations (Fog, Mist, Haze, Smoke, Dust)
    if (details.conditionCode.includes('fg') || forecastLower.includes('fog') ||
        details.conditionCode.includes('br') || forecastLower.includes('mist') || 
        details.conditionCode.includes('hz') || forecastLower.includes('haze') ||
        details.conditionCode.includes('fu') || forecastLower.includes('smoke') || 
        details.conditionCode.includes('du') || forecastLower.includes('dust') ||   
        details.conditionCode.includes('sa') || forecastLower.includes('sand')) {  
        // Use the densest cloudy icon you have, differentiating day/night
        return details.timeOfDay === 'day' ? AmCloudyDay3 : AmCloudyNight3; 
    }

    // 4. Cloud Cover (from Clear to Overcast) - Consider `details.isWindy` if you want windy variants
    if (details.conditionCode === 'skc' || details.conditionCode === 'nskc' || forecastLower.includes("clear") || forecastLower.includes("sunny")) {
        // if (details.isWindy && AmWindyDayClear) return AmWindyDayClear; // If you have windy clear icons
        return details.timeOfDay === 'day' ? AmDayClear : AmNightClear;
    }
    if (details.conditionCode === 'few' || details.conditionCode === 'nfew') {
        return details.timeOfDay === 'day' ? AmCloudyDay1 : AmCloudyNight1;
    }
    if (details.conditionCode === 'sct' || details.conditionCode === 'nsct') { // Scattered clouds
        return details.timeOfDay === 'day' ? AmCloudyDay2 : AmCloudyNight2;
    }
    if (details.conditionCode === 'bkn' || details.conditionCode === 'nbkn' || forecastLower.includes("partly cloudy")) { // Broken clouds / Partly cloudy
        return details.timeOfDay === 'day' ? AmCloudyDay3 : AmCloudyNight3;
    }
    if (details.conditionCode === 'ovc' || details.conditionCode === 'novc' || forecastLower.includes("mostly cloudy") || forecastLower.includes("overcast")) {
        // Use the densest cloudy icon you have, differentiating day/night
        return details.timeOfDay === 'day' ? AmCloudyDay3 : AmCloudyNight3;
    }
    
    // 5. Windy (if not already handled by isWindy variants of above conditions)
    // NWS also has generic "wind_ovc", "wind_bkn", "wind_sct", "wind_few", "wind_skc"
    // The `getNwsIconDetails` function was updated to extract `isWindy` and the base condition.
    // This block could handle cases where `shortForecast` just says "Windy"
    if (details.isWindy || forecastLower.includes('windy') || forecastLower.includes('breezy')) {
        // If you have a standalone animated wind icon like AmWind:
        // return AmWind;
        // Otherwise, fall back to a partly cloudy or slightly active icon
        // as wind is often accompanied by some clouds or just implies air movement.
        return details.timeOfDay === 'day' ? AmCloudyDay1 : AmCloudyNight1; // Example fallback
    }

    // If no specific mapping is found after all checks:
    console.warn(`No specific amCharts mapping for NWS condition code: "${details.conditionCode}", timeOfDay: "${details.timeOfDay}", isWindy: ${details.isWindy}, shortForecast: "${nwsShortForecast}", NWS Icon URL: "${nwsIconUrl}"`);
    return null; // Fallback to NWS image icon
};


//#endregion
    

const Weather = ()=>{

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //#region Helper to get Icon component from NWS icon URL

    const DisplayWeatherIcon = ({ nwsConditionText, nwsIconUrl, iconType }) => {
        // Call the mapping function
        const AmChartIconToRender = mapNwsToAmChartsIconComponent(nwsConditionText, nwsIconUrl);
    
        // Define base and specific CSS classes
        const baseClass = "weather-condition-icon";
        const amchartsSpecificClass = `amcharts-icon ${iconType}-amcharts-icon`;
        const nwsSpecificClass = `nws-icon ${iconType}-nws-icon`;
        const altText = nwsConditionText || `${iconType.charAt(0).toUpperCase() + iconType.slice(1)} Weather Icon`;
    
        if (AmChartIconToRender) {
            // If we have a mapped amCharts component, render it
            return <AmChartIconToRender className={`${baseClass} ${amchartsSpecificClass}`} />;
        } else if (nwsIconUrl) {
            // Else, if no amChartIcon but we have an NWS URL, use the NWS icon as backup
            return (
                <img
                    src={nwsIconUrl}
                    alt={altText}
                    className={`${baseClass} ${nwsSpecificClass}`}
                />
            );
        } else {
            // Else, show a placeholder
            return <span className="icon-placeholder">?</span>;
        }
    };

    //#endregion





    useEffect(()=>{
        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);
            try{
                //Quardinates for Ammon, Idaho
                const lat = 43.4676;
                const lon = -111.9735;

                const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`); // NEW - Add /api prefix
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setWeatherData(data);
            }catch(e){
                console.error("Error fetching weather data:", e);
                setError(e.message);
            }finally{
                setLoading(false);
            }
        }

        fetchWeatherData();
    }, []);

    let currentTemp = weatherData?.currentConditions?.temperatureF;
    let locationName = weatherData?.locationName;
    let currentConditionsIcon = weatherData?.currentConditions?.iconUrl;
    let currentConditionsText = weatherData?.currentConditions?.conditionsText;
    let currentSunrise = weatherData?.calculatedTimes?.sunrise;
    let currentSunset = weatherData?.calculatedTimes?.sunset;
    let currentHumidity = weatherData?.currentConditions?.humidityPercent;
    let currentWind = weatherData?.currentConditions?.windSpeedMph;
    let hourlyForecast = weatherData?.hourlyForecast;
    let dailyForecast = weatherData?.dailyForecast;
    

    return(
        <div className="Weather-Box">
            <div className="weather-header"> {/* Need to Add Dynamic Background */}
                <div className="grid-item location">🚩{locationName}, ID</div>
                <div className="grid-item icon">
                    <DisplayWeatherIcon nwsConditionText={currentConditionsText} nwsIconUrl={currentConditionsIcon} iconType="current" />
                </div>
                
                <div className="grid-item temp">{currentTemp}°F</div>
                <div className="grid-item forecast">{currentConditionsText}</div>
                
                <div className="grid-item hourly">
                    <div className="day-details">
                        <div className="wind">
                            <div className="wind-icon">💨</div>
                            <div className="wind-speed">{currentWind} mph</div>
                        </div>
                        <div className="humidity">
                            <div className="humidity-icon">💧</div>
                            <div className="humidity-percentage">{currentHumidity}%</div>
                        </div>
                        <div className="sunrise">
                            <div className="sunrise-icon">🌅</div>
                            <div className="sunrise-time">{currentSunrise}</div>
                        </div>
                        <div className="sunset">
                            <div className="sunset-icon">🌇</div>
                            <div className="sunset-time">{currentSunset}</div>
                        </div>
                    </div>


                    

                    <div className="hourly-forecast">
                        {hourlyForecast?.map((hour)=>{
                            return(
                                <div className="hour" key={hour.time}>
                                    <div className="hour-time">{hour.time}</div>
                                    <div className="hour-temp">{hour.tempF}°F</div>
                                    <div className="hour-icon">
                                        <DisplayWeatherIcon nwsConditionText={hour.condition} nwsIconUrl={hour.icon} iconType="hourly" />
                                    </div>
                                    <div className='wind-speed'>{hour.windSpeed}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            
            <div className="weather-forecast">

                {dailyForecast?.map((day,index)=>{

                    let displayName; 

                    if(index === 0){
                        displayName = "Today";
                    }else if(index === 1){
                        displayName = "Tomorrow";
                    }
                    else{
                        displayName = day.dayName;
                    }

                    const date = new Date();
                    //console.log("Date:", addDays(date, index));
                    const times = SunCalc.getTimes(addDays(date, index), 43.4676, -111.9735);
                    const sunrise = format(toZonedTime(times.sunrise, 'America/Denver'), 'HH:mm');
                    const sunset = format(toZonedTime(times.sunset, 'America/Denver'), 'HH:mm');


                    return(
                        <div className='top-weekly' key={day.dateShort}>
                            <div className='grid-item-day' >
                                <div className="weather-day">
                                    <div className='weather-date'>{day.dateShort}</div>
                                    <div className='weather-weekday'>{displayName}</div>
                                </div>
                                <div className='weather-daily-2'>
                                    <div className='weather-precipitation'>💧 {day.pop}%</div>
                                    <div className='weather-wind'>💨 {day.windSpeed}</div>
                                </div>
                                <div className='SR_SS'>
                                    <div className='sunrise'>🌅 {sunrise}</div>
                                    <div className='sunset'>🌇 {sunset}</div>
                                </div>
                                <div className='weather-fc'>
                                    <div className='weather-icon'>
                                        <DisplayWeatherIcon nwsConditionText={day.condition} nwsIconUrl={day.icon} iconType="daily" />
                                    </div>
                                    <div className='weather-temp'>
                                        <div className='weather-temp-high'>{day.highF}°F</div>
                                        <div className='weather-temp-low'>{day.lowF}°F</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                })}

            </div>

        </div>



    )



}

export default Weather;


