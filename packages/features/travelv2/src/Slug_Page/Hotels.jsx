import React from 'react'
import {formatDirectusTimeOnly, formatDirectusDateToMMDDYY} from '@wade-usa/auth'



/**
 * @component Hotels
 * @description Renders a list of hotels for a specific trip.
 * This component takes an array of hotel objects and displays them in a structured layout.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.hotels - An array of hotel objects to be displayed. Each object should contain details like name, address, check-in/out times, etc.
 * @returns {React.ReactElement} The rendered list of hotels.
 */
function Hotels({ hotels }) {
    // console.log(hotels) // Good for debugging the hotels data
  return (
    <div className='slug_hotels_container'>
        <h2>Hotels</h2>
        {/* Map over the hotels array to render each hotel individually */}
        {hotels.map((hotel, index) => (
            <div key={index} className='slug_hotel'>
                {/* Box 0: Main hotel header with name */}
                <div className='slug_hotel_box0'>
                    <h3>🏨 Hotel {index +1} - {hotel.hotel_name} </h3>
                </div>
                {/* Box 1: Hotel address */}
                <div className='slug_hotel_box1'>
                    <h4>{hotel.hotel_address}</h4>
                </div>
                {/* Box 2: Check-in date and time */}
                <div className='slug_hotel_box2'>
                    <h4><i><b>Check in:</b></i></h4>
                    <h3>{formatDirectusDateToMMDDYY(hotel.checkin)}</h3>
                    <h5>@ {formatDirectusTimeOnly(hotel.checkin)}</h5>
                </div>
                {/* Box 3: Check-out date and time */}
                <div className='slug_hotel_box3'>
                    <h4><i><b>Check out:</b></i></h4>
                    <h3>{formatDirectusDateToMMDDYY(hotel.checkout)}</h3>
                    <h5>@ {formatDirectusTimeOnly(hotel.checkout)}</h5>
                </div>
                <div className='slug_hotel_box4'>
                    <h4><i>Notes: {hotel.note}</i></h4>
                </div>

            </div>
        ))}
    </div>
  )
}

export default Hotels