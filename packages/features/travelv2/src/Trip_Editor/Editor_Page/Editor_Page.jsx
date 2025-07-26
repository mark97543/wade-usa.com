import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Editor_Page.css'
import {fetchTripsBySlug} from '@wade-usa/auth'
import Sample_Card from '../sample_card/Sample_Card.jsx'



function Editor_Page() {
  const { tripID } = useParams() // We destructure tripID to get the slug.
  const [tripData, setTripData] = useState(null) // Initialize with null to better handle loading state
  const [tripSummary, setTripSummary]=useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripImage, setTripImage] = useState(null)
  
  /* ----------------------- fetch the slug information ----------------------- */
  useEffect(()=>{
    const fetchTrip = async()=>{
      // fetchTripsBySlug likely returns an array, even if it's just one item.
      const trips = await fetchTripsBySlug(tripID)
      if (trips && trips.length > 0) {
        const trip = trips[0]; // Get the first trip from the array
        setTripData(trip);
        setTripSummary(trip.trip_summary); // Set summary from the freshly fetched data
        setStartDate(trip.start_date);
        setEndDate(trip.end_date);
        setTripImage(trip.trip_image);
        setTripImage(trip.trip_image);
      }
    }
    fetchTrip()

  },[tripID])

  // Render a loading state while tripData is null (i.e., being fetched)
  if (!tripData) {
    return <h2>Loading...</h2>;
  }

  // Once data is loaded, render the editor. The return must be a single valid JSX element.
  return (
    <div className='editor_page_wrapper'>
      <h1>Editing: {tripData.trip_title}</h1>

      {/* Need to wrap all of this in a form*/}
      <div className='editor_page_card'>
        <h1>Card Edit</h1>

        <label htmlFor="summary">Enter Trip Summary:</label>
        <textarea id="summary" maxLength="200" rows="4" value={tripSummary} onChange={(e) => setTripSummary(e.target.value)} required ></textarea>
        <p>This is a brief description of the trip. It is limited to 200 characters.</p>

        <label htmlFor="start-date">Start Date:</label>
        <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>

        <label htmlFor="end-date">End Date:</label>
        <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>

        <label htmlFor="trip-image">Trip Image:</label>
        <input
            type="file"
            id="trip-image"
            onChange={(e) => setTripImage(e.target.files[0])}
            accept="image/*"
        />
        <p>Upload an image to represent the trip. Should be 3:2 aspect ratio. </p>

        <div className="trip-editor-sample-card">
          <h3>Sample Tile</h3>
          <Sample_Card item={{ trip_title: tripData.trip_title, trip_summary: tripSummary, trip_image: tripImage, start_date: startDate, end_date: endDate }} />
        </div>

      </div>
    </div>
  )
}

export default Editor_Page