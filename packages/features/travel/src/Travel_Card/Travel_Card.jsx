import React from 'react'
import './Travel_card.css'

function Travel_Card({ item}) {

    if(!item.trip_card){
        item.trip_card="ab95449e-d70f-486b-94d0-affed6a7bfa1.jpg"
    }

 
  return (
    <div className='travel_card_box'>
        <img className='trip_card_image' src={`https://wade-usa-assets.sfo3.digitaloceanspaces.com/${item.trip_card}`}/>
        <h3 className='trip_card_title'>{item.trip_title}</h3>
    </div>
  )
}

export default Travel_Card