//client/src/pages/blog/Tables/Table_Rentals.jsx

import React, { useState, useMemo } from 'react'

function Table_Rentals({rentals}) {

    const [rent, setRent]=useState([])
    
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
            {formattedDate} at {formattedTime}
        </>
        );
    };

      // If rentals is not provided, is not an array, or is an empty array, render nothing.
    if (!rentals || !Array.isArray(rentals) || rentals.length === 0) {
        return null; // Or you could return a <p>No flight information available.</p> if preferred
    }

    const processedRentals = useMemo(()=>{
    if(!rentals || !Array.isArray(rentals) ||rentals.length ===0 ){
        return[]; //return an empty array with no valid flights
    }

    // 2. Sorting Logic
    // Create a new sorted array to avoid mutating the prop directly
    const sortedRentals = [...rentals].sort((a,b)=>{
        // Need to be a valid date string or timestamp
        const dateA = new Date(a.pickup).getTime()
        const dateB = new Date(b.pickup).getTime()

        if(isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1; // Put NaNs (invalid dates) at the end
        if (isNaN(dateB)) return -1;

        return dateA - dateB; // For ascending order (earliest first)

    })
    //console.log("Sorted flights:", sortedFlights);
    setRent(sortedRentals)

    }, [rentals])

    
    return (
        <div className='rental-table-wrapper'>
            <h3>Car Rental</h3>
            <table className='rental-table'>
                <thead>
                    <tr>
                        <th>Pickup <br></br> Dropoff</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {rent.map((item)=>{
                        return(
                            <tr key={item.id}>
                                <td>{formatFullDateTime(item.pickup)}<br></br>{formatFullDateTime(item.dropoff)}</td>
                                <td>{item.company}</td>
                                <td>{item.location}</td>
                                <td>{item.note}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
      
        </div>
  )
}

export default Table_Rentals
