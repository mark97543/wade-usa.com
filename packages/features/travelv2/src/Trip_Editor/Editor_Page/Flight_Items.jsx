import React from 'react'

function Flight_Items({ flights, handleFlightChange, addFlight, deleteFlight }) {
  return (
    <div className='editor_page_flights'>
        <h2>Flights</h2>

        {flights.length > 0 ? (
            flights.map((flight, index) => (
                <div key={flight.id || index} className="editor_page_flight_item">
                <h4 id="flight_number">Flight {index + 1}</h4>

                <div id="editor_page_flight_left_panel">
                    <label htmlFor="airline">Airline:</label>
                    <input type="text" id="airline" value={flight.airline || ''} onChange={(e) => handleFlightChange(index, 'airline', e.target.value)}/>

                    <label htmlFor="flight">Flight Number:</label>
                    <input type="text" id="flight" value={flight.flight || ''} onChange={(e) => handleFlightChange(index, 'flight', e.target.value)}/>

                    <label htmlFor={`duration-hours-${index}`}>Duration:</label>
                    <div className="editor_page_flight_duration">
                        <input
                            type="number"
                            id={`duration-hours-${index}`}
                            placeholder="H"
                            value={flight.duration_hours || ''}
                            onChange={(e) => handleFlightChange(index, 'duration_hours', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                            min="0"
                        />
                        <span>h</span>
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

                <div id="editor_page_flight_mid_top_panel">
                    <div className="gen_cont">
                        <label htmlFor='from_ap_code'>From:</label>
                        <input type="text" id="from_ap_code" className='flight_ap_code_input' value={flight.from_ap_code || ''} onChange={(e) => handleFlightChange(index, 'from_ap_code', e.target.value.toUpperCase())} maxLength="3"/>
                    </div>
                    <h1 id='editor_page_flight_arrow'>➡️</h1>
                    <div className="gen_cont">
                        <label htmlFor='to_ap_code'>To:</label>
                        <input type="text" id="to_ap_code" className='flight_ap_code_input' value={flight.to_ap_code || ''} onChange={(e) => handleFlightChange(index, 'to_ap_code', e.target.value.toUpperCase())} maxLength="3"/>
                    </div>
                </div>

                <div id="editor_page_flight_mid_bottom_panel1">
                    <input type="text" id="from" value={flight.from || ''} onChange={(e) => handleFlightChange(index, 'from', e.target.value)} placeholder="City"/>
                    <label htmlFor={`start-datetime-${index}`}>Depart:</label>
                    <input type="datetime-local" id={`start-datetime-${index}`} value={flight.start ? flight.start.slice(0, 16) : ''} onChange={(e) => handleFlightChange(index, 'start', e.target.value)}/>
                </div>

                <div id="editor_page_flight_mid_bottom_panel2">
                    <input type="text" id="to" value={flight.to || ''} onChange={(e) => handleFlightChange(index, 'to', e.target.value)} placeholder="City"/>
                    <label htmlFor={`end-datetime-${index}`}>Arrive:</label>
                    <input type="datetime-local" id={`end-datetime-${index}`} value={flight.end ? flight.end.slice(0, 16) : ''} onChange={(e) => handleFlightChange(index, 'end', e.target.value)}/>
                </div>

                <div id="editor_page_flight_Note_panel">
                    <label htmlFor="note">Note:</label>
                    <input type="text" id="note" value={flight.note || ''} onChange={(e) => handleFlightChange(index, 'note', e.target.value)} placeholder="Notes"/>
                </div>
                
                <div className='editor_page_flight_item_remove'>
                  <button onClick={() => deleteFlight(flight.id)}>-</button>
                </div>
                

              </div>
            ))
          ):(
            <h4>No Flights</h4>
          )}

          <button type="button" onClick={addFlight}>Add Flight</button>
        </div>
  )
}

export default Flight_Items
