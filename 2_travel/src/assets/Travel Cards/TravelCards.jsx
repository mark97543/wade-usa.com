import React from 'react'
import './TravelCards.css'
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import { formatDirectusDateToYYMMDD } from '@contexts/HelperFunctions';


function TravelCards({data}) {
    const navigate = useNavigate(); // <-- Initialize useNavigate hook
    let pictureURL = data.image; //Not Required
    const title = data.trip_title; //Required
    const auther = data.auther; //Required
    const created = formatDirectusDateToYYMMDD(data.date_created)
    const summary = data.summary; //Required
    const link = data.link
    

    //Throws in placeholder if non url is provided. 
    if(!pictureURL){
        pictureURL='https://api.wade-usa.com/assets/174ac8c8-9f69-4952-a2c7-59ebdda28ac9.jpg'
    }else{
        pictureURL=`https://api.wade-usa.com/assets/${pictureURL}`
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

    console.log(data)

  return (
    <div className='travelcard_shell' onClick={()=>handleCardClick()}>
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