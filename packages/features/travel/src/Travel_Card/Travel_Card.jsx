import React from 'react'
import './Travel_card.css'

function Travel_Card({ item}) {

    if(!item.trip_card){
        console.log("No Image")
    }

 
  return (
    <div className='travel_card_box'>
        <p>Travel Cars</p>
    </div>
  )
}

export default Travel_Card