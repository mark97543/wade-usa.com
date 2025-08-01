import React from 'react'
import {formatDirectusTimeOnly, formatDirectusDateToMMDDYY} from '@wade-usa/auth'



function Hotels({hotels}) {
    console.log(hotels)
  return (
    <div className='slug_hotels_container'>
        <h2>Hotels</h2>
        {hotels.map((hotel, index) => (
            <div key={index} className='slug_hotel'>
                <div className='slug_hotel_box0'>
                    <h3>🏨 Hotel {index +1} - {hotel.hotel_name} </h3>
                </div>
                <div className='slug_hotel_box1'>
                    <h4>{hotel.hotel_address}</h4>
                </div>
                <div className='slug_hotel_box2'>
                    <h4><i><b>Check in:</b></i></h4>
                    <h3>{formatDirectusDateToMMDDYY(hotel.checkin)}</h3>
                    <h5>@ {formatDirectusTimeOnly(hotel.checkin)}</h5>
                </div>
                <div className='slug_hotel_box3'>
                    <h4><i><b>Check out:</b></i></h4>
                    <h3>{formatDirectusDateToMMDDYY(hotel.checkout)}</h3>
                    <h5>@ {formatDirectusTimeOnly(hotel.checkout)}</h5>
                </div>
                <div className='slug_hotel_box4'>
                    <h4><i>Notes: </i></h4>
                    <h4>{hotel.note}</h4>
                </div>
             
            </div>
        ))}
    </div>
  )
}

export default Hotels