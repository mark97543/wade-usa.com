import React, {useState, useEffect} from 'react'
import './Travel_Home.css'
import {fetchAllTrips} from '@wade-usa/auth'
import Travel_Card from '../Travel_Card/Travel_Card';


function Travel_Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    const loadTrips = async ()=>{
      const tripData = await fetchAllTrips();
      setTrips(tripData); // Update the state with the fetched data
      setLoading(false);  // Set loading to false once data is loaded
    }
    loadTrips();
  }, [])

  if(loading){
    return <div>Loading Trips...</div>
  }

  return (
    <div className='travel_home_wrapper'>

      {trips.map((trip)=>(
        <Travel_Card key={trip.id} item={trip} />
      ))}

    
    
    </div>
  )
}

export default Travel_Home