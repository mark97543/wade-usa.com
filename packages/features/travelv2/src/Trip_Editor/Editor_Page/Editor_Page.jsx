import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Editor_Page.css'
import {fetchTripsBySlug} from '@wade-usa/auth'


function Editor_Page() {
  const { tripID } = useParams() // We destructure tripID to get the slug.
  const [tripData, setTripData] = useState({})


  /* ----------------------- fetch the slug information ----------------------- */
  useEffect(()=>{
    const fetchTrip = async()=>{
      const trip = await fetchTripsBySlug(tripID)
      setTripData(trip)
    }
    fetchTrip()
  },[tripID])

  console.log(tripData)


  return (
    <div className='editor_page_wrapper'>
      <h1>Editor Page</h1>
      <p>You are editing the trip with slug: {tripID}</p>

      <div className='editor_page_card'>
        <h1>General Incormation</h1>
        <p>This is the travel Card Items</p>
      </div>

    </div>
  )
}

export default Editor_Page