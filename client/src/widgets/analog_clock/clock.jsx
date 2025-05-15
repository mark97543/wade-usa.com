// /client/src/widgets/analog_clock/clock.jsx
import React, { useEffect, useState } from "react";
import './clock.css';

// --- Helper function getTimePartsInTimezone (as defined previously) ---
function getTimePartsInTimezone(dateObject, timeZoneString) {
    // ... (implementation from the previous answer)
    if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
        console.error("Invalid dateObject passed to getTimePartsInTimezone. Using current local time as fallback.");
        const now = new Date();
        return {
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
            error: "Invalid input date provided to timezone converter"
        };
    }
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: timeZoneString,
        });
        const parts = formatter.formatToParts(dateObject);
        const result = {};
        parts.forEach(part => {
            if (part.type === 'hour') result.hours = parseInt(part.value, 10);
            else if (part.type === 'minute') result.minutes = parseInt(part.value, 10);
            else if (part.type === 'second') result.seconds = parseInt(part.value, 10);
        });
        if (typeof result.hours === 'undefined' || isNaN(result.hours) ||
            typeof result.minutes === 'undefined' || isNaN(result.minutes) ||
            typeof result.seconds === 'undefined' || isNaN(result.seconds)) {
            throw new Error('Could not extract all time parts for the given timezone.');
        }
        return result;
    } catch (error) {
        console.error(`Error getting time for timezone "${timeZoneString}": ${error.message}. Defaulting to original date's local time.`);
        return {
            hours: dateObject.getHours(),
            minutes: dateObject.getMinutes(),
            seconds: dateObject.getSeconds(),
            error: `Failed to process timezone "${timeZoneString}": ${error.message}`
        };
    }
}

const Analog_Clock = ({
    timezone,
    location_Name,
    // Props for hand dimensions with default values
    // These defaults match what you had in your CSS/previous JS
    hourHandHeight: propHourHandHeight = 50,
    hourHandWidth: propHourHandWidth = 6,
    minuteHandHeight: propMinuteHandHeight = 75,
    minuteHandWidth: propMinuteHandWidth = 4,
    secondHandHeight: propSecondHandHeight = 80,
    secondHandWidth: propSecondHandWidth = 2
}) => {
    const [currentInstant, setCurrentInstant] = useState(new Date());
    const [effectiveTimeZone, setEffectiveTimeZone] = useState(timezone);

    useEffect(() => {
        if (!timezone) {
            try {
                const detectedTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setEffectiveTimeZone(detectedTZ);
            } catch (e) {
                console.error("Could not detect local timezone, defaulting to direct local time parts.", e);
                setEffectiveTimeZone(null);
            }
        } else {
            setEffectiveTimeZone(timezone);
        }
    }, [timezone]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentInstant(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    let timeToDisplay;
    if (effectiveTimeZone) {
        timeToDisplay = getTimePartsInTimezone(currentInstant, effectiveTimeZone);
    } else {
        timeToDisplay = {
            hours: currentInstant.getHours(),
            minutes: currentInstant.getMinutes(),
            seconds: currentInstant.getSeconds(),
        };
    }

    const {
        hours: displayHours,
        minutes: displayMinutes,
        seconds: displaySeconds,
        error: timeError
    } = timeToDisplay;

    if (timeError) {
        console.warn(`AnalogClock: Displaying fallback time for "${effectiveTimeZone || 'local'}" due to error: ${timeError}`);
    }

    // Rotation calculations (no change here)
    const hoursForCalc = displayHours % 12;
    const hourDeg = (hoursForCalc + displayMinutes / 60) * 30;
    const minuteDeg = (displayMinutes + displaySeconds / 60) * 6;
    const secondDeg = displaySeconds * 6;

    return (
        <div className="clock-box">
            <div className="clock_local">
                <div className="dot"></div>
                {/* Numbers */}
                <div className="clock_hour clock_twelve"><div className="clock_12_inner">12</div></div>
                <div className="clock_hour clock_one"><div className="clock_1_inner">1</div></div>
                <div className="clock_hour clock_two"><div className="clock_2_inner">2</div></div>
                <div className="clock_hour clock_three"><div className="clock_3_inner">3</div></div>
                <div className="clock_hour clock_four"><div className="clock_4_inner">4</div></div>
                <div className="clock_hour clock_five"><div className="clock_5_inner">5</div></div>
                <div className="clock_hour clock_six"><div className="clock_6_inner">6</div></div>
                <div className="clock_hour clock_seven"><div className="clock_7_inner">7</div></div>
                <div className="clock_hour clock_eight"><div className="clock_8_inner">8</div></div>
                <div className="clock_hour clock_nine"><div className="clock_9_inner">9</div></div>
                <div className="clock_hour clock_ten"><div className="clock_10_inner">10</div></div>
                <div className="clock_hour clock_eleven"><div className="clock_11_inner">11</div></div>

                {/* Hands - Updated to use props for dimensions */}
                <div
                    className="clock_hand clock_hour_hand"
                    style={{
                        width: `${propHourHandWidth}px`,
                        height: `${propHourHandHeight}px`,
                        transform: `translateX(-${propHourHandWidth / 2}px) translateY(-${propHourHandHeight}px) rotate(${hourDeg}deg)`
                        // background and z-index will come from CSS class .clock_hour_hand
                    }}
                ></div>
                <div
                    className="clock_hand clock_minute_hand"
                    style={{
                        width: `${propMinuteHandWidth}px`,
                        height: `${propMinuteHandHeight}px`,
                        transform: `translateX(-${propMinuteHandWidth / 2}px) translateY(-${propMinuteHandHeight}px) rotate(${minuteDeg}deg)`
                        // background and z-index will come from CSS class .clock_minute_hand
                    }}
                ></div>
                <div
                    className="clock_hand clock_second_hand"
                    style={{
                        width: `${propSecondHandWidth}px`,
                        height: `${propSecondHandHeight}px`,
                        transform: `translateX(-${propSecondHandWidth / 2}px) translateY(-${propSecondHandHeight}px) rotate(${secondDeg}deg)`
                        // background and z-index will come from CSS class .clock_second_hand
                    }}
                ></div>
            </div>
            <div className="Location_Titile">{location_Name}</div>
        </div>
    );
}

export default Analog_Clock;