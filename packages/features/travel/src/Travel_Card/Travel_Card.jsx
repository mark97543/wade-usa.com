import React from 'react'
import './Travel_card.css'
import {formatDirectusDateToYYMMDD} from '@wade-usa/auth'


function Travel_Card({ item}) {

    if(!item.trip_card){
        item.trip_card="ab95449e-d70f-486b-94d0-affed6a7bfa1"
    }

 
  return (
    <div className='travel_card_box'>
        <img className='trip_card_image' src={`https://api.wade-usa.com/assets/${item.trip_card}`}/>
        <h2 className='trip_card_title'>{item.trip_title}</h2>
        <h3 className='trip_card_dates'><i>{`From ${item.start_date} to ${item.end_date}`}</i></h3>
        <p className='trip_card_summary'>{item.trip_summary}</p>

        <p className='trip_card_misc_date'><i>{`Created on: ${formatDirectusDateToYYMMDD(item.date_created)} Last Update: ${formatDirectusDateToYYMMDD(item.date_updated)}`}</i></p>
    </div>
  )
}

export default Travel_Card