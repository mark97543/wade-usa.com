//client/src/pages/blog/Tables/Table_Rentals.jsx

import React from 'react'

function Table_Rentals({rentals}) {
    
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
                    {rentals.map((item)=>{
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
