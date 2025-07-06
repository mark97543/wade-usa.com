import React, {useState, useEffect} from 'react'
import { formatDirectusDateToMMDDYY, formatDirectusDateTime, formatDirectusTimeOnly, addDurationToDate } from '@wade-usa/auth';

function Days({day}) {
    const [dayWithCalculations, setDayWithCalculations] = useState(null);

    useEffect(() => {
        // Exit if the base 'day' object isn't ready.
        if (!day || !day.trip_day) {
            return;
        }

        // --- THIS IS THE FIX ---
        // If there are no day_details, we can still set the state and finish.
        if (!day.day_details || day.day_details.length === 0) {
            // Set the state with the original day object, ensuring day_details is an empty array.
            setDayWithCalculations({
                ...day,
                day_details: [] 
            });
            return; // Stop the effect here.
        }

        // --- The rest of your calculation logic runs only if there ARE details ---

        let previousDepartureTime = day.trip_day;

        const calculatedEvents = day.day_details.map((event) => {
            const calculatedArrival = addDurationToDate(
                previousDepartureTime,
                event.time_to_h || 0,
                event.time_to_m || 0
            );
            const calculatedDeparture = addDurationToDate(
                calculatedArrival,
                event.duration_h || 0,
                event.duration_m || 0
            );

            const finalArrival = event.hard_start ? new Date(`${day.trip_day.split('T')[0]}T${event.hard_start}`) : calculatedArrival;
            const finalDeparture = event.hard_end ? new Date(`${day.trip_day.split('T')[0]}T${event.hard_end}`) : calculatedDeparture;

            previousDepartureTime = finalDeparture;

            return {
                ...event,
                calculated_arrival: finalArrival,
                calculated_departure: finalDeparture
            };
        });

        const newDayObject = {
            ...day,
            day_details: calculatedEvents
        };

        setDayWithCalculations(newDayObject);

    }, [day]);
    // If our calculated data isn't ready yet, show a loading message.
    if (!dayWithCalculations) {
        return <div>Calculating day plan...</div>;
    }

    console.log(dayWithCalculations)

  return (
    <>
        <h2>{`Day ${dayWithCalculations.day_number}, ${formatDirectusDateToMMDDYY(dayWithCalculations.trip_day)}, Planned Departure: ${formatDirectusTimeOnly(dayWithCalculations.trip_day)}`}</h2>
        <p>{dayWithCalculations.day_notes}</p>
        {dayWithCalculations.day_details ? (

            dayWithCalculations.day_details.map((events, index) => (
                <div key={index}>

                    
                    {(events.time_to_h || events.time_to_m) ? (
                        <div className="hr-sect">
                            {`Travel Time: ${events.time_to_h}h ${events.time_to_m}m`}
                        </div>
                    ):('')}

                    <div className='day_event_container'>

                        <div className='even_index_div'>
                            <h3>{index+1}</h3>
                        </div>
                        <div className='day_name_dic'>
                            <h4>{events.name}</h4>
                        </div>
                        <div className='day_location_dic'>
                            <h4>{events.location}</h4>
                        </div>
                        <div className='day_note_div'>
                            <h4>{`Note: ${events.note ? events.note : ""}`}</h4>
                        </div>
                        <div className='day_arrive_text'>
                            <h4>Arrive</h4>
                        </div>
                        <div className='day_depart_text'>
                            <h4>Depart</h4>
                        </div>
                        <div className='day_stay_text'>
                            <h4>Duration</h4>
                        </div>

                        <div className='day_arrive_calc_text'>
                            <h4>{formatDirectusTimeOnly(events.calculated_arrival)}</h4>
                        </div>
                        <div className='day_depart_calc_text'>
                            <h4>{formatDirectusTimeOnly(events.calculated_departure)}</h4>
                        </div>
                        <div className='day_duration_text'>
                            <h4>{`${events.duration_h}h ${events.duration_m}m`}</h4>
                        </div>
                    </div>
                </ div>
            ))
        ) : (
            // This is the "else" part. We return null or an empty string to render nothing.
            null 
        )}
    </>
  )
}

export default Days