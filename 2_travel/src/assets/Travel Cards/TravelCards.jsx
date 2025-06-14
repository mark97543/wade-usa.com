import React from 'react'
import './TravelCards.css'

function TravelCards({data}) {

    let pictureURL = data.image; //Not Required
    const title = data.trip_title; //Required
    const auther = data.auther; //Required
    const created = data.created; //Required
    const summary = data.summary; //Required
    

    //Throws in placeholder if non url is provided. 
    if(!pictureURL){
        pictureURL='https://api.wade-usa.com/assets/174ac8c8-9f69-4952-a2c7-59ebdda28ac9.jpg'
    }

    //Created Date


  return (
    <div className='travelcard_shell'>
        <div className='travelcard_pictue'>
            <img src={pictureURL} alt="Placeholder"></img>
        </div>
        <div className='travelcard_text'>
            <p>{title}</p>
            <p>{`By: ${auther} ${created}`}</p>
            <p>{summary}</p>
        </div>
        
    </div>
  )
}
export default TravelCards


//Note 1: Aspect Ratio of Pictures Need to Be 3:2