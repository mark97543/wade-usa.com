import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Editor_Page.css'
import {fetchTripsBySlug} from '@wade-usa/auth'
import Sample_Card from '../sample_card/Sample_Card.jsx'
import Flight_Items from '../Editor_Page/Flight_Items.jsx'



function Editor_Page() {
  const { tripID } = useParams() // We destructure tripID to get the slug.
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null) // Initialize with null to better handle loading state
  const [tripSummary, setTripSummary]=useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripImage, setTripImage] = useState(null)
  const [flights, setFlights]=useState([])

  
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
        // Ensure flights is always an array, defaulting to an empty one if null/undefined.
        //TODO: Need to organize by start Date
        setFlights(trip.flights || [])
      }
    }
    fetchTrip()

  },[tripID])

  // Render a loading state while tripData is null (i.e., being fetched)
  if (!tripData) {
    return <h2>Loading...</h2>;
  }

  /* ----------------- Cancels Edit and returns to Travel Home ---------------- */
  const cancelForm = () => {
      navigate('/travel');
  }

  /* ---------------------------- adds a new flight --------------------------- */
  const addFlight = ()=>{
    // Create a new flight object with default empty values.
    const newFlight = {
      // Using a temporary unique ID for the key prop during rendering.
      id: `new-${Date.now()}`,
      start: null,
      end: null,
      airline: '',
      flight: '',
      from: '',
      from_ap_code: '',
      to: '',
      to_ap_code: '',
      duration_hours: null,
      duration_minutes: null,
      note: '',
    };
    // Use the callback form of setFlights to append the new flight to the previous state.
    setFlights(prevFlights => [...(prevFlights || []), newFlight]);
  }

  const handleFlightChange = (index, field, value) => {
    setFlights(prevFlights => {
      const newFlights = [...prevFlights];
      newFlights[index] = { ...newFlights[index], [field]: value };
      return newFlights;
    });
  };

  /* ------------------------------ Delete Flight ----------------------------- */

  const deleteFlight = (flightId) => {
    setFlights(prevFlights => prevFlights.filter(flight => flight.id !== flightId));
  }

  

  console.log(tripData)


  // Once data is loaded, render the editor. The return must be a single valid JSX element.
  return (
    <div className='editor_page_wrapper'>
      <h1>Editing: {tripData.trip_title}</h1>

      <form id="trip-editor-form">

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

        <Flight_Items flights={flights} handleFlightChange={handleFlightChange} addFlight={addFlight} deleteFlight={deleteFlight} />

        <div className='editor_page_submit'>
          <button type="submit">Submit</button> {/* TODO: Need Submit Function*/}
          <button type="button" onClick={cancelForm}>Cancel</button>
        </div>

      </form>
    </div>
  )
}

export default Editor_Page
