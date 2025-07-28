import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTripsBySlug } from '@wade-usa/auth'
import './Slug.css'
import {useAuth} from '@wade-usa/auth'
import {useNavigate} from 'react-router-dom'
import Flights from './Flights'


function Slug() {
  const { slug } = useParams() // Correctly destructure 'slug' to match the route parameter
  const navigate = useNavigate()
  const allowedRoles = ['Administrator','Basic']
  const {user, isLoggedIn} = useAuth()
  const [item, setItem] = useState(null)
  
  const hanfleEditTrip=()=>{
    navigate(`/travel/editor-page/${slug}`)
  }

  useEffect(() => {
    const fetchTrip = async () => {
      const trips = await fetchTripsBySlug(slug)
      if (trips && trips.length > 0) {
        const trip = trips[0]; // Assuming slug is unique, take the first result
        // Sort flights by start date before setting state
        if (trip.flights && Array.isArray(trip.flights)) {
          trip.flights.sort((a, b) => new Date(a.start) - new Date(b.start));
        }
        setItem(trip);
      } else {
        console.log(`No trip found with slug: ${slug}`)
      }
    }
    fetchTrip()
  }, [slug]) // Dependency array ensures this runs only when slug changes


  if (!item) {
    return <div>Loading...</div>
  }



  return (
    <div className='slug-container'>
      {isLoggedIn && allowedRoles.includes(user?.role?.name) ? <button onClick={hanfleEditTrip}>Edit Trip</button> : ""}
      <img className='slug_banner_picture' src={`https://api.wade-usa.com/assets/${item.banner_picture}`}/>
      <h1>{item.trip_title}</h1>
      <h3><i>{`From ${item.start_date} to ${item.end_date}`}</i></h3>
      <div className='slug_long_summary' dangerouslySetInnerHTML={{ __html: item.long_summary }} />

      <h1>Trip Itinerary</h1>

      {item.flights && Array.isArray(item.flights) && item.flights.length > 0 ? (
        <Flights flights={item.flights} />
      ) : (
        ""
      )}

    </div>
  )
}

export default Slug