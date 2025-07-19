import React from 'react';
import { formatDirectusDateToMMDDYY, formatDirectusDateTime } from '@wade-usa/auth';

function Flights({ flights }) {
  // 1. Group flights by their final_destination
  const groupedFlights = flights.reduce((groups, flight) => {
    const destination = flight.flight_group;
    // If a group for this destination doesn't exist yet, create it
    if (!groups[destination]) {
      groups[destination] = [];
    }
    // Add the current flight to its destination group
    groups[destination].push(flight);
    return groups;
  }, {});

  return (
    <div className='trip_display_flights'>
      {/* 2. Map over the grouped flights object */}
      {Object.entries(groupedFlights).map(([destination, flightGroup], groupIndex) => (
        // A fragment to hold each destination's section
        <React.Fragment key={groupIndex}>
          
          <div className="destination-group-header">
            <h3>{destination} on {formatDirectusDateToMMDDYY(flightGroup[0].depart)}</h3>
          </div>

          <div className='trip_display_flights_data'>
            {flightGroup.map((flight, flightIndex) => (
              <div key={flightIndex} className='trip_display_flight_container'>
                <div className='flight_data_row'>
                    <div className='trip_display_departing_flight'>
                        <h5>Departing</h5>
                        <h4>{formatDirectusDateTime(flight.depart)}</h4>
                        <h1>{flight.departing_airport}</h1>
                        <h4>{flight.departing_airport_full}</h4>
                    </div>
                    <div className='flights_arrow'>
                        <h1>→</h1>
                    </div>
                    <div className='trip_display_departing_flight'>
                        <h5>Arriving</h5>
                        <h4>{formatDirectusDateTime(flight.arrive)}</h4>
                        <h1>{flight.arriving_airport}</h1>
                        <h4>{flight.arrival_airport_full}</h4>
                    </div>
                    <div className='flights_misc_data'>
                        <h4>{`Airline: ${flight.airline}`}</h4>
                        <h4>{`Flight: ${flight.flight}`}</h4>
                        <h4>{`Duration: ${flight.duration_hours}h ${flight.duration_minutes}m`}</h4>
                    </div>
                </div>
                {flight.note ? 
                <h4 className='flight_note'>{`Note: ${flight.note}`}</h4>
                :("")}
                {(flight.layover_hours || flight.layover_minutes) ? (
                  <div className="hr-sect">
                    {`Layover ${flight.layover_hours || 0}h ${flight.layover_minutes || 0}m`}
                  </div>
                ) : (
                  "" // Render nothing if there's no layover
                )}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Flights;

