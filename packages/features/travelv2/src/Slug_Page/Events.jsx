import React from 'react'
import {formatDirectusTimeOnly, formatDirectusDateToMMDDYY} from '@wade-usa/auth'
//
/**
 * @component Events
 * @description Renders a list of events or activities for a specific trip.
 * This component takes an array of event objects and displays them in a structured layout.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.events - An array of event objects to be displayed.
 * @returns {React.ReactElement} The rendered list of events.
 */
function Events({events}) {
    // console.log(events) // Good for debugging the events data
  return (
    <div className='slug_events_container'>
        <h2>Events/Activities</h2>
        {/* Map over the events array to render each one individually */}
        {events.map((event, index) => (
            <div key={index} className='slug_event'>
                {/* Main header with event name */}
                <h3>🎪 Event {index +1} - {event.event_name}</h3>
                {/* Section for the event start date and time */}
                <div className='slug_event_start'>
                    <h4><i><b>Event Start:</b></i></h4>
                    <h3>{formatDirectusDateToMMDDYY(event.start)} at {formatDirectusTimeOnly(event.start)}</h3>
                </div>
                {/* Section for the event location */}
                <div className='slug_event_end'>
                    <h4><i><b>Location:</b></i></h4>
                    <h3>{event.event_location}</h3>
                </div>
                <h4><i><b>Notes:</b></i></h4>
                <h3>{event.note}</h3>
            </div>
        ))}
    </div>
  )
}

export default Events