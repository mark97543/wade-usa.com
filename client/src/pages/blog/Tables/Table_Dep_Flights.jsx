//client/src/pages/blog/Tables/Table_Dep_Flights.jsx
import React, { useState, useMemo } from 'react'


const Table_Dep_Flights = ({flights}) => {
  const [depFlight, setDepFlight]=useState(flights)

  // Helper function to format the date and time string
  const formatFullDateTime = (dateString) => {
    if (!dateString) {
      return 'N/A'; // Or some other placeholder if the date is not available
    }
    
    const date = new Date(dateString);

    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
      console.warn("Encountered an invalid date string:", dateString);
      return 'Invalid Date'; 
    }

    const month = date.getMonth() + 1; // Months are 0-indexed
    const day = date.getDate();
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

    const hours = String(date.getHours()).padStart(2, '0'); // Get hours (0-23) and pad with leading zero if needed
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
    return (
      <>
        {formattedDate}
        <br />
        {formattedTime}
      </>
    );
  };

  // If flights is not provided, is not an array, or is an empty array, render nothing.
  if (!depFlight || !Array.isArray(depFlight) || depFlight.length === 0) {
    return null; // Or you could return a <p>No flight information available.</p> if preferred
  }

  //Memoize the processed (filtered and sorted) flights
  // This ensures the filtering and sorting logic only re-runs if the 'flights' prop changes.

  const processedFlights = useMemo(()=>{
    if(!depFlight || !Array.isArray(depFlight) ||depFlight.length ===0 ){
      return[]; //return an empty array with no valid flights
    }

    // 1. Filtering Logic
    // Example: Filter out flights where item.status is not 'confirmed'
    // Replace 'status' and 'confirmed' with your actual field and value
    const filteredFlights = depFlight.filter(flight =>{
      // Example: return flight.status === 'confirmed'; 
      return flight.type === 'departure';
    })

    //console.log("Filtered flights:", filteredFlights);

    // 2. Sorting Logic
    // Create a new sorted array to avoid mutating the prop directly
    const sortedFlights = [...filteredFlights].sort((a,b)=>{
      // Need to be a valid date string or timestamp
      const dateA = new Date(a.departure_time).getTime()
      const dateB = new Date(b.departure_time).getTime()

      if(isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1; // Put NaNs (invalid dates) at the end
      if (isNaN(dateB)) return -1;

      return dateA - dateB; // For ascending order (earliest first)

    })
    //console.log("Sorted flights:", sortedFlights);
    setDepFlight(sortedFlights)

  }, [flights])


  return (
      <div className='dep-table-wrapper'>
          <h3>Departing Flights</h3>
          <table className='dep-table'>
            <thead>
              <tr>
                <th>Depart</th>
                <th>Airline <br></br> Flight</th>
                <th>From</th>
                <th>Arrival</th>
                <th>To</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {depFlight.map((item)=>{
                return(
                  <tr key={item.id}>
                    <td>{formatFullDateTime(item.departure_time)}</td>
                    <td>{item.airline} <br></br>{item.flight}</td>
                    <td>{item.dep_airport}</td>
                    <td>{formatFullDateTime(item.arrival_time)}</td>
                    <td>{item.arrival_airport}</td>
                    <td>{item.note}</td>
                  </tr>
                )
              })}

            </tbody>
          </table>
      </div>
  )
}

export default Table_Dep_Flights
