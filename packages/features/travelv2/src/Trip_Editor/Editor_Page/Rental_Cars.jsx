import React from 'react'

/**
 * @component Rental_Cars
 * @description Renders a list of editable rental car items for a trip.
 * @param {object} props - The component props.
 * @param {Array<object>} [props.rentalCars=[]] - An array of rental car objects to be displayed.
 * @param {Function} props.handleRentalCarChange - Callback function to handle changes in any rental car input field.
 * @param {Function} props.addRentalCar - Callback function to add a new rental car to the list.
 * @param {Function} props.deleteRentalCar - Callback function to remove a rental car from the list.
 * @returns {React.ReactElement} The rendered rental car items section.
 */
function Rental_Cars({ rentalCars = [], handleRentalCarChange, addRentalCar, deleteRentalCar }) {
  return (
    <div className='editor_page_rental_cars'>
      <h2>Rental Cars</h2>
      {rentalCars.length > 0 ? (
        rentalCars.map((car, index) => (
          <div key={car.id || index} className="editor_page_rental_car_item">
            <h4 id="rental_car_number">Rental Car {index + 1}</h4>
            <div className="editor_page_rental_car_fields">
              <label htmlFor={`company-${index}`}>Company:</label>
              <input type="text" id={`company-${index}`} value={car.company || ''} onChange={(e) => handleRentalCarChange(index, 'company', e.target.value)} />

              <label htmlFor={`pickup-location-${index}`}>Pickup Location:</label>
              <input type="text" id={`pickup-location-${index}`} value={car.pickup_location || ''} onChange={(e) => handleRentalCarChange(index, 'pickup_location', e.target.value)} />

              <label htmlFor={`dropoff-location-${index}`}>Dropoff Location:</label>
              <input type="text" id={`dropoff-location-${index}`} value={car.dropoff_location || ''} onChange={(e) => handleRentalCarChange(index, 'dropoff_location', e.target.value)} />

              <label htmlFor={`pickup-date-${index}`}>Pickup Date:</label>
              <input type="datetime-local" id={`pickup-date-${index}`} value={car.pickup_date ? car.pickup_date.slice(0, 16) : ''} onChange={(e) => handleRentalCarChange(index, 'pickup_date', e.target.value)} />

              <label htmlFor={`dropoff-date-${index}`}>Dropoff Date:</label>
              <input type="datetime-local" id={`dropoff-date-${index}`} value={car.dropoff_date ? car.dropoff_date.slice(0, 16) : ''} onChange={(e) => handleRentalCarChange(index, 'dropoff_date', e.target.value)} />
            </div>
            <div className='editor_page_rental_car_item_remove'>
              <button type="button" onClick={() => deleteRentalCar(index)}>-</button>
            </div>
          </div>
        ))
      ) : (
        <h4>No Rental Cars</h4>
      )}
      <button id="add_rental_car_button" type="button" onClick={addRentalCar}>Add Rental Car</button>
    </div>
  )
}

export default Rental_Cars;
