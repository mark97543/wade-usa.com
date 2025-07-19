import React from 'react'
import './Travel_card.css'
import {formatDirectusDateToYYMMDD} from '@wade-usa/auth'
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

function Travel_Card({ item}) {
    const navigate = useNavigate(); // <-- Initialize useNavigate hook
    const link = item.slug

    //Give Default Image if none
    if(!item.trip_card){
        item.trip_card="ab95449e-d70f-486b-94d0-affed6a7bfa1"
    }

    const handleCardClick = () => {
      if (link) { // Ensure slug exists before navigating
          navigate(`/travel/${link}`); // Programmatic navigation using the slug
      } else {
          console.warn("Cannot navigate: slug is missing for this travel card.");
          // Optionally, navigate to a default error page or show a message
          // navigate('/error-page');
      }
    };

 
  return (
    <div className='travel_card_box' onClick={handleCardClick}>
        <img className='trip_card_image' src={`https://api.wade-usa.com/assets/${item.trip_card}`}/>
        <h2 className='trip_card_title'>{item.trip_title}</h2>
        <h3 className='trip_card_dates'><i>{`From ${item.start_date} to ${item.end_date}`}</i></h3>
        <p className='trip_card_summary'>{item.trip_summary}</p>

        <p className='trip_card_misc_date'><i>{`Created on: ${formatDirectusDateToYYMMDD(item.date_created)} Last Update: ${formatDirectusDateToYYMMDD(item.date_updated)}`}</i></p>
    </div>
  )
}

export default Travel_Card