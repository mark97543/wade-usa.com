import React from 'react'
import {formatDirectusTimeOnly, formatDirectusDateToMMDDYY} from '@wade-usa/auth'


/**
 * @component Rental_Cars
 * @description Renders a list of rental cars for a specific trip.
 * This component takes an array of rental car objects and displays them in a structured layout.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.rental_cars - An array of rental car objects to be displayed.
 * @returns {React.ReactElement} The rendered list of rental cars.
 */
function Rental_Cars({rental_cars}) {
    // console.log(rental_cars) // Good for debugging the rental_cars data
  return (
    <div className='slug_rental_cars_container'>
        <h2>Rental Cars</h2>
        
        {/* Map over the rental_cars array to render each one individually */}
        {rental_cars.map((rental_car, index) =>(
            <div key={index} className='slug_rental_car'>
                {/* Box 0: Main header with company name */}
                <div className='slug_rental_car_box0'>
                    <h3>🚗 Rental Car {index +1} - {rental_car.company}</h3>
                </div>
                {/* Box 1: Pickup details */}
                <div className='slug_rental_car_box1'>
                    <h5><i><b>Pickup:</b></i></h5>
                    <h4><i><b>Location: </b></i>{rental_car.pickup_location}</h4>
                    <h4><i><b>Date:</b></i> {formatDirectusDateToMMDDYY(rental_car.pickup_date)}</h4>
                    <h4><i><b>Time: </b></i>{formatDirectusTimeOnly(rental_car.pickup_date)}</h4>
                </div>
                {/* Box 2: Dropoff details */}
                <div className='slug_rental_car_box2'>
                    <h5><i><b>Dropoff:</b></i></h5>
                    <h4><i><b>Location: </b></i>{rental_car.dropoff_location}</h4>
                    <h4><i><b>Date:</b></i> {formatDirectusDateToMMDDYY(rental_car.dropoff_date)}</h4>
                    <h4><i><b>Time: </b></i>{formatDirectusTimeOnly(rental_car.dropoff_date)}</h4>
                </div>
                {/* Box 3: Additional notes for the rental car */}
                <div className='slug_rental_car_box3'>
                    <h4><i>Notes: {rental_car.note}</i></h4>
                </div>
            </div>
        ))}

    </div>
  )
}

export default Rental_Cars