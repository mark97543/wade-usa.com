// /client/src/widgets/weather/weather.jsx

import React from "react";
import './weather.css'

const Weather = ()=>{

    return(
        <div className="Weather-Box">
            <div className="weather-header"> {/* Need to Add Dynamic Background */}
                <div className="grid-item location">🚩Ammon</div>
                <div className="grid-item icon">☀️</div> {/* Need to Add Dynamic Icon */}
                <div className="grid-item temp">79°F</div>
                <div className="grid-item forecast">Moderate Rain</div>
                <div className="grid-item hourly">
                    <div className="day-details">
                        <div className="wind">
                            <div className="wind-icon">💨</div>
                            <div className="wind-speed">10 mph</div>
                        </div>
                        <div className="humidity">
                            <div className="humidity-icon">💧</div>
                            <div className="humidity-percentage">60%</div>
                        </div>
                        <div className="sunrise">
                            <div className="sunrise-icon">🌅</div>
                            <div className="sunrise-time">6:00 AM</div>
                        </div>
                        <div className="sunset">
                            <div className="sunset-icon">🌇</div>
                            <div className="sunset-time">7:00 PM</div>
                        </div>
                    </div>


                    <div className="hourly-forecast">
                        <div className="hour">
                            <div className="hour-time">1 PM</div>
                            <div className="hour-temp">80°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">2 PM</div>
                            <div className="hour-temp">81°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">3 PM</div>
                            <div className="hour-temp">82°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">4 PM</div>
                            <div className="hour-temp">83°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">5 PM</div>
                            <div className="hour-temp">84°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">6 PM</div>
                            <div className="hour-temp">85°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">7 PM</div>
                            <div className="hour-temp">86°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">8 PM</div>
                            <div className="hour-temp">87°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">9 PM</div>
                            <div className="hour-temp">88°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">10 PM</div>
                            <div className="hour-temp">89°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">11 PM</div>
                            <div className="hour-temp">90°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                        <div className="hour">
                            <div className="hour-time">12 AM</div>
                            <div className="hour-temp">91°F</div>
                            <div className="hour-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        </div>
                    </div>
                </div>

            </div>
            
            <div className="weather-forecast">
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 11</div>
                        <div className="weather-weekday">Today</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">79°F</div>
                        <div className="weather-temp-low">49°F</div>
                    </div>
                </div>
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 12</div>
                        <div className="weather-weekday">Tomorrow</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">80°F</div>
                        <div className="weather-temp-low">50°F</div>
                    </div>
                </div>
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 13</div>
                        <div className="weather-weekday">Saturday</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">81°F</div>
                        <div className="weather-temp-low">51°F</div>
                    </div>
                </div>
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 14</div>
                        <div className="weather-weekday">Sunday</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">82°F</div>
                        <div className="weather-temp-low">52°F</div>
                    </div>
                </div>
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 15</div>
                        <div className="weather-weekday">Monday</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">83°F</div>
                        <div className="weather-temp-low">53°F</div>
                    </div>
                </div>
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 16</div>
                        <div className="weather-weekday">Tuesday</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">84°F</div>
                        <div className="weather-temp-low">54°F</div>
                    </div>
                </div>
                <div className="grid-item-day">
                    <div className="weather-day">
                        <div className="weather-date">May 17</div>
                        <div className="weather-weekday">Wednesday</div>
                    </div>
                    <div className="weather-fc">
                        <div className="weather-icon">☀️</div>{/* Need to Add Dynamic Icon */}
                        <div className="weather-temp-high">85°F</div>
                        <div className="weather-temp-low">55°F</div>
                    </div>
                </div>
            </div>

        </div>



    )



}

export default Weather;