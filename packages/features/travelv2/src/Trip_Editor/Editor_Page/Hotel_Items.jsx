import React from 'react'

/**
* @component Hotel_Items
* @description Renders a list of editable hotel items for a trip.
* @param {object} props - The component props.
* @param {Array<object>} [props.hotels=[]] - An array of hotel objects to be displayed.
* @param {Function} props.handleHotelChange - Callback function to handle changes in any hotel input field.
* @param {Function} props.addHotel - Callback function to add a new hotel to the list.
* @param {Function} props.deleteHotel - Callback function to remove a hotel from the list.
* @returns {React.ReactElement} The rendered hotel items section.
*/
function Hotel_Items({ hotels = [], handleHotelChange, addHotel, deleteHotel }) {
  return (
    <div className='editor_page_hotels'>
        <h2>Hotels</h2>
        {/* Conditionally render the list of hotels or a "No Hotels" message. */}
        {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
                <div key={hotel.id || index} className="editor_page_hotel_item">
                    <h4 id="hotel_number">Hotel {index + 1}</h4>
                    <div className="editor_page_hotel_fields">
                        <label htmlFor={`hotel-name-${index}`}>Hotel Name:</label>
                        <input type="text" id={`hotel-name-${index}`} value={hotel.hotel_name || ''} onChange={(e) => handleHotelChange(index, 'hotel_name', e.target.value)} />
                        
                        <label htmlFor={`hotel-address-${index}`}>Address:</label>
                        <textarea id={`hotel-address-${index}`} value={hotel.hotel_address || ''} onChange={(e) => handleHotelChange(index, 'hotel_address', e.target.value)} rows="3" />

                        <label htmlFor={`checkin-datetime-${index}`}>Check-in:</label>
                        <input type="datetime-local" id={`checkin-datetime-${index}`} value={hotel.checkin ? hotel.checkin.slice(0, 16) : ''} onChange={(e) => handleHotelChange(index, 'checkin', e.target.value)} />

                        <label htmlFor={`checkout-datetime-${index}`}>Check-out:</label>
                        <input type="datetime-local" id={`checkout-datetime-${index}`} value={hotel.checkout ? hotel.checkout.slice(0, 16) : ''} onChange={(e) => handleHotelChange(index, 'checkout', e.target.value)} />

                        <label htmlFor={`hotel-note-${index}`}>Note:</label>
                        <input type="text" id={`hotel-note-${index}`} value={hotel.note || ''} onChange={(e) => handleHotelChange(index, 'note', e.target.value)} placeholder="Notes"/>
                    </div>
                    <div className='editor_page_hotel_item_remove'>
                        <button type="button" onClick={() => deleteHotel(index)}>-</button>
                    </div>
                </div>
            ))
        ) : (
            <h4>No Hotels</h4>
        )}
        {/* Button to add a new, empty hotel item to the list. */}
        <button id="add_hotel_button" type="button" onClick={addHotel}>Add Hotel</button>
    </div>
  )
}

export default Hotel_Items