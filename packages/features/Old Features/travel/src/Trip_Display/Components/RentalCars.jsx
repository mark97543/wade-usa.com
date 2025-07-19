import React from 'react'
import {formatDirectusDateToMMDDYY, formatDirectusDateTime} from '@wade-usa/auth'



function RentalCars({rentalCars}) {

  return (
    <div className='rental_cars_wrapper'>
        <h3>Rental Cars</h3>
        <div className='rental_cars_box'>
            {rentalCars.map((rental, index)=>{
                const isLastItem = index === rentalCars.length - 1;

                return(
                    <div key={index}>
                        <div className='rental_car_details'>
                            <div className='rental_company'>
                                <h3>{rental.company}</h3>
                            </div>
                            <div className='rental_pickup_time'>
                                <h4>{`Pickup Time: ${formatDirectusDateTime(rental.pickup_time)}`}</h4>
                            </div>
                            <div className='rental_dropoff_time'>
                                <h4>{`Dropoff Time: ${formatDirectusDateTime(rental.dropoff_time)}`}</h4>
                            </div>
                            <div>
                                <h4>{`Pickup Location: ${rental.pickup_location}`}</h4>
                            </div>
                            <div>
                                <h4>{`Dropoff Location: ${rental.dropoff_location}`}</h4>
                            </div>
                            <div>
                                <h4>{`Note: ${rental.note}`}</h4>
                            </div>
                        </div>
                        {!isLastItem && <div className="hr-sect">Next Rental</div>} 
                    </div>
                )
            })}
        </div>

    </div>
  )
}

export default RentalCars