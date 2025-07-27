import React from 'react';

/**
 * @component Flight_Items
 * @description Renders a list of editable flight items for a trip.
 * It allows for adding, deleting, and modifying individual flight details.
 * This component is purely presentational and relies on props for all data and event handling.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.flights - An array of flight objects to be displayed and edited.
 * @param {Function} props.handleFlightChange - Callback function to handle changes in any flight input field.
 * @param {Function} props.addFlight - Callback function to add a new flight to the list.
 * @param {Function} props.deleteFlight - Callback function to remove a flight from the list.
 * @returns {React.ReactElement} The rendered flight items section.
 */
function Flight_Items({ flights, handleFlightChange, addFlight, deleteFlight }) {
  return (
    <div className='editor_page_flights'>
        <h1>Flights</h1>

        {/* Conditionally render the list of flights or a "No Flights" message. */}
        {flights.length > 0 ? (
            flights.map((flight, index) => (
                // Use the flight's database ID for existing flights, or a temporary index for new ones, as the key.
                <div key={flight.id || index} className="editor_page_flight_item">
                <h4 id="flight_number">Flight {index + 1}</h4>

                {/* Left Panel: Contains airline, flight number, and duration inputs. */}
                <div id="editor_page_flight_left_panel">
                    <label htmlFor="airline">Airline:</label>
                    {/* Controlled input for the airline name. */}
                    <input type="text" id="airline" value={flight.airline || ''} onChange={(e) => handleFlightChange(index, 'airline', e.target.value)}/>

                    <label htmlFor="flight">Flight Number:</label>
                    {/* Controlled input for the flight number. */}
                    <input type="text" id="flight" value={flight.flight || ''} onChange={(e) => handleFlightChange(index, 'flight', e.target.value)}/>

                    <label htmlFor={`duration-hours-${index}`}>Duration:</label>
                    <div className="editor_page_flight_duration">
                        {/* Controlled input for duration in hours. Converts empty input to null. */}
                        <input
                            type="number"
                            id={`duration-hours-${index}`}
                            placeholder="H"
                            value={flight.duration_hours || ''}
                            // When the input is cleared, set the value to null instead of an empty string.
                            onChange={(e) => handleFlightChange(index, 'duration_hours', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                            min="0"
                        />
                        <span>h</span>
                        {/* Controlled input for duration in minutes. Converts empty input to null. */}
                        <input
                            type="number"
                            id={`duration-minutes-${index}`}
                            placeholder="M"
                            value={flight.duration_minutes || ''}
                            onChange={(e) => handleFlightChange(index, 'duration_minutes', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                            min="0"
                            max="59"
                        />
                        <span>m</span>
                    </div>
                </div>

                {/* Middle Top Panel: Contains departure and arrival airport codes. */}
                <div id="editor_page_flight_mid_top_panel">
                    <div className="gen_cont">
                        <label htmlFor='from_ap_code'>From:</label>
                        {/* Input for the 3-letter departure airport code. Automatically converts to uppercase. */}
                        <input type="text" id="from_ap_code" className='flight_ap_code_input' value={flight.from_ap_code || ''} onChange={(e) => handleFlightChange(index, 'from_ap_code', e.target.value.toUpperCase())} maxLength="3"/>
                    </div>
                    <h1 id='editor_page_flight_arrow'>➡️</h1>
                    <div className="gen_cont">
                        <label htmlFor='to_ap_code'>To:</label>
                        {/* Input for the 3-letter arrival airport code. Automatically converts to uppercase. */}
                        <input type="text" id="to_ap_code" className='flight_ap_code_input' value={flight.to_ap_code || ''} onChange={(e) => handleFlightChange(index, 'to_ap_code', e.target.value.toUpperCase())} maxLength="3"/>
                    </div>
                </div>

                {/* Middle Bottom Panel 1: Departure city and date/time. */}
                <div id="editor_page_flight_mid_bottom_panel1">
                    <input type="text" id="from" value={flight.from || ''} onChange={(e) => handleFlightChange(index, 'from', e.target.value)} placeholder="City"/>
                    <label htmlFor={`start-datetime-${index}`}>Depart:</label>
                    {/* The value is sliced to match the 'YYYY-MM-DDTHH:mm' format required by datetime-local input. */}
                    <input type="datetime-local" id={`start-datetime-${index}`} value={flight.start ? flight.start.slice(0, 16) : ''} onChange={(e) => handleFlightChange(index, 'start', e.target.value)}/>
                </div>

                {/* Middle Bottom Panel 2: Arrival city and date/time. */}
                <div id="editor_page_flight_mid_bottom_panel2">
                    <input type="text" id="to" value={flight.to || ''} onChange={(e) => handleFlightChange(index, 'to', e.target.value)} placeholder="City"/>
                    <label htmlFor={`end-datetime-${index}`}>Arrive:</label>
                    {/* The value is sliced to match the 'YYYY-MM-DDTHH:mm' format required by datetime-local input. */}
                    <input type="datetime-local" id={`end-datetime-${index}`} value={flight.end ? flight.end.slice(0, 16) : ''} onChange={(e) => handleFlightChange(index, 'end', e.target.value)}/>
                </div>

                {/* Note Panel: A simple text input for flight-specific notes. */}
                <div id="editor_page_flight_Note_panel">
                    <label htmlFor="note">Note:</label>
                    <input type="text" id="note" value={flight.note || ''} onChange={(e) => handleFlightChange(index, 'note', e.target.value)} placeholder="Notes"/>
                </div>
                
                {/* Remove Button: Calls the deleteFlight prop with the current flight's index. */}
                <div className='editor_page_flight_item_remove'>
                    <button type="button" onClick={() => deleteFlight(index)}>-</button>                
                </div>
                

              </div>
            ))
          ):(
            <h4>No Flights</h4>
          )}

          {/* Button to add a new, empty flight item to the list. */}
          <button id="add_flight_button" type="button" onClick={addFlight}>Add Flight</button>
        </div>
  );
}

export default Flight_Items;
