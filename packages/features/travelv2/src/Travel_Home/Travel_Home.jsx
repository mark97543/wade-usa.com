import React, {useState, useEffect} from 'react'
import {useAuth} from '@wade-usa/auth'
import {useNavigate} from 'react-router-dom'
import './Travel_Home.css'
import {fetchAllTrips} from '@wade-usa/auth'
import Travel_Cards from './Travel_Cards/Travel_Cards'



function Travel_Home() {

  const {user, isLoggedIn} = useAuth()
  const allowedRoles = ['Administrator','Basic']
  const navigate = useNavigate()
  const [tripData, setTripData] = useState([])


  //Navigate to Trip Editor 
  const handleAddTrip=()=>{
    navigate('trip-editor')
  }

  /* -------------------- Pull all triup data on page loade ------------------- */
  useEffect(() => {
    const fetchTrips = async () => {
      const trips = await fetchAllTrips();
      setTripData(trips);
    }
    fetchTrips();
  }, [])

  console.log(tripData)


  return (
    <div className='travel-home-container'>
      <h1>Upcomming Trips</h1>

      {isLoggedIn && allowedRoles.includes(user?.role?.name) ? <button onClick={handleAddTrip}>Add Trip</button> : ""}

      <div className='travel_home_travel_cards'>
        {tripData.map((item, index) => (
          <Travel_Cards key={index} item={item} />
        ))}
      </div>

    </div>

  )
}

export default Travel_Home



//TODO: Need to link cards to slugs (Add finger when hover over)
//TODO: Add pagination
//TODO: Need to test when there are no trips