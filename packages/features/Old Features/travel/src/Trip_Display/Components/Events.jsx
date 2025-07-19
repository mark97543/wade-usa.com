import React from 'react'
import {formatDirectusDateToMMDDYY, formatDirectusDateTime} from '@wade-usa/auth'


function Events({events}) {
  return (
    <div className='events_wrapper'>
        <h3>Events</h3>
        <div className='events_box'>
            {events.map((event, index)=>{
                const isLastItem = index === events.length - 1;

                return(
                    <div key={index}>
                        <div className='event_details'>
                            <div className='event'>
                                <h3>{event.event}</h3>
                            </div>
                            <div className='event_location'>
                                <h4>{event.location}</h4>
                            </div>
                            <div className='event_start'>
                                <h4>{`Start Time: ${formatDirectusDateTime(event.start_time)}`}</h4>
                            </div>
                            <div className='event_end'>
                                <h4>{`End Time: ${formatDirectusDateTime(event.end_time)}`}</h4>
                            </div>
                            <div className='event_note'>
                                <h4>{`Note: ${event.note}`}</h4>
                            </div>
                        </div>
                        {!isLastItem && <div className="hr-sect">Next Event</div>} 
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Events