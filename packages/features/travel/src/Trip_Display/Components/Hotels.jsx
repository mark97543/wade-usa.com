import React from 'react'
import {formatDirectusDateToMMDDYY, formatDirectusDateTime} from '@wade-usa/auth'



function Hotels({hotels}) {

  return (
    <div className='hotels_wrapper'>
        <h3>Hotels</h3>
        <div className='hotels_box'>
            {hotels.map((hotel, index)=>{

                const isLastItem = index === hotels.length - 1;

                return(
                    <>
                    <div className='hotel_details' key={index}>
                        <div className='hotel_name'>
                            <h3>{hotel.hotel_name}</h3>
                        </div>
                        <div className='hotel_address'>
                            <h4>{hotel.hotel_address}</h4>
                        </div>
                        <div className='hotel_checkin'>
                            <h4>{`Checkin: ${formatDirectusDateTime(hotel.checkin)}`}</h4>
                        </div>
                        <div className='hotel_checkout'>
                            <h4>{`Checkout: ${formatDirectusDateTime(hotel.checkout)}`}</h4>
                        </div>
                        <div className='hotel_note'>
                            <h4>{hotel.note}</h4>
                        </div>
                    </div>
                    {!isLastItem && <div className="hr-sect">Next Hotel</div>} 
                    </>
            )})}
        </div>
    </div>
  )
}

export default Hotels