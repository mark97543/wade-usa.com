import React from 'react'
import {formatDirectusTimeOnly, formatDirectusDateToMMDDYY} from '@wade-usa/auth'



function Flights({flights}) {
    console.log(flights)
  return (
    <div className='slug_flights_container'>
        <h2>Flights</h2>
        {flights.map((flight, index) => (
            <div key={index} className='slug_flight'>
                <div className='slug_flight_box0'>
                    <h3>{`✈️ Flight ${index +1} - ${flight.airline} ( ${flight.flight} ) - ${formatDirectusDateToMMDDYY(flight.start)}`} </h3>
                </div>
                <div className='slug_flight_box1'>
                    <h4><b>Airline:</b> {flight.airline}</h4>
                    <h4><b>Flight:</b> {flight.flight}</h4>
                    <h4><b>Duration:</b> {flight.duration_hours}h{flight.duration_minutes}m</h4>
                </div>
                <div className='slug_flight_box2'>
                    <h2>{flight.from_ap_code}</h2>
                    <h2>►</h2>
                    <h2>{flight.to_ap_code}</h2>
                </div>
                <div className='slug_flight_box3'>
                    <h5>{flight.from}</h5>
                    <h3>{formatDirectusTimeOnly(flight.start)}</h3>
                    <h5>{formatDirectusDateToMMDDYY(flight.start)}</h5>
                </div>
                <div className='slug_flight_box4'>
                    <h5>{flight.to}</h5>
                    <h3>{formatDirectusTimeOnly(flight.end)}</h3>
                    <h5>{formatDirectusDateToMMDDYY(flight.end)}</h5>
                </div>
                <div className='slug_flight_box5'>
                    <h5><i>Notes: {flight.note}</i></h5>
                </div>
    
            </div>
        ))}
    </div>
  )
}

export default Flights