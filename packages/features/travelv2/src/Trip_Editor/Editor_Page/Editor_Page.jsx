/**
 * @file Editor_Page.jsx
 * @module Editor_Page
 * @description This component serves as the main editor page for a trip. It fetches
 * trip data based on a URL parameter, allows users to edit trip details and associated
 * flights, and handles the submission of these updates to the backend.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import './Editor_Page.css'
import {fetchTripsBySlug} from '@wade-usa/auth'
import {updateTripV2} from '@wade-usa/auth'
import Editor_Page_Card from './Editor_Page_Card.jsx'
import Flight_Items from './Flight_Items.jsx'



function Editor_Page() {
  // Get the trip slug from the URL. Note: tripID from params is actually the slug.
  const { tripID } = useParams();
  const navigate = useNavigate();

  // State for the entire trip object fetched from the database.
  const [tripData, setTripData] = useState(null);
  // State for individual form fields, decoupled from tripData to allow editing.
  const [tripSummary, setTripSummary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripImage, setTripImage] = useState(null);
  const [tripTaken, setTripTaken] = useState(false);

  // State for managing flights.
  const [flights, setFlights] = useState([]);
  // Store the initial state of flights to detect deletions.
  const [initialFlights, setInitialFlights] = useState([]);

  // UI state management.
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  /**
   * Fetches trip data when the component mounts or the tripID (slug) changes.
   * Populates the component's state with the fetched data.
   */
  useEffect(() => {
    const fetchTrip = async () => {
      const trips = await fetchTripsBySlug(tripID);
      if (trips && trips.length > 0) {
        const trip = trips[0]; // Assuming slug is unique, take the first result.
        setTripData(trip);
        // Populate form state from the fetched trip data.
        setTripSummary(trip.trip_summary);
        setStartDate(trip.start_date);
        setEndDate(trip.end_date);
        setTripImage(trip.trip_image);
        // Ensure flights is always an array, defaulting to an empty one if null/undefined.
        const sortedFlights = (trip.flights || []).sort((a, b) => new Date(a.start) - new Date(b.start));
        setFlights(sortedFlights);
        setInitialFlights(sortedFlights);
        setTripTaken(trip.trip_taken);
      }
    };
    fetchTrip();
  }, [tripID]); // Dependency array ensures this runs only when tripID changes.

  /**
   * Handles the form submission.
   * It constructs a payload for updating the trip and its related flights,
   * including creating new flights, updating existing ones, and deleting removed ones.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // --- Flight Payload Preparation for Directus Deep Write ---

    // 1. Identify flights to be CREATED.
    // These are flights with a temporary ID starting with 'new-'.
    const createdFlights = flights
      .filter(f => String(f.id).startsWith('new-'))
      .map(({ id, ...data }) => data); // Omit temporary client-side ID

    // 2. Identify flights to be UPDATED.
    // These are flights that have an existing (numeric) ID.
    const updatedFlights = flights.filter(f => !String(f.id).startsWith('new-'));

    // 3. Identify flights to be DELETED.
    // This is done by finding which of the initial flights are no longer present.
    const currentFlightIds = new Set(updatedFlights.map(f => f.id));
    const deletedFlightIds = initialFlights
      .filter(f => !currentFlightIds.has(f.id))
      .map(f => f.id);

    // 4. Construct the final flights payload for the One-to-Many relationship.
    // Directus handles create/update based on the presence of an 'id' in each object.
    const flightsPayload = [
      ...createdFlights,
      ...updatedFlights
    ];

    // --- Main Trip Data Payload ---

    const tripUpdateData = {
      trip_summary: tripSummary,
      start_date: startDate,
      end_date: endDate,
      flights: flightsPayload,
      trip_taken: tripTaken,
    };

    // Conditionally add the trip image to the payload.
    // If it's a File object, it's a new upload. Otherwise, we don't send it,
    // and the existing image on the server remains unchanged.
    if (tripImage instanceof File) {
      tripUpdateData.trip_image = tripImage;
    }

    try {
      await updateTripV2(tripData.id, tripUpdateData, deletedFlightIds);
      alert('Trip updated successfully!');
      navigate(`/travel/${tripData.slug}`); // Navigate to the updated trip page
    } catch (error) {
      console.error("Failed to update trip:", error);
      alert('Failed to update trip. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Render a loading indicator while the initial trip data is being fetched.
  if (!tripData) {
    return <h2>Loading...</h2>;
  }

  /**
   * Navigates the user back to the main travel page, canceling the edit.
   */
  const cancelForm = () => {
      navigate('/travel');
  }

  /**
   * Adds a new, empty flight object to the `flights` state array.
   */
  const addFlight = () => {
    const newFlight = {
      // Use a temporary, client-side unique ID for React's `key` prop.
      // This also helps identify new flights during submission.
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
    // Append the new flight to the existing flights array.
    setFlights(prevFlights => [...(prevFlights || []), newFlight]);
  }

  /**
   * Handles changes to any field of a specific flight item.
   * @param {number} index - The index of the flight being changed in the `flights` array.
   * @param {string} field - The name of the field being updated (e.g., 'airline', 'from').
   * @param {any} value - The new value for the field.
   */
  const handleFlightChange = (index, field, value) => {
    setFlights(prevFlights => {
      const newFlights = [...prevFlights];
      newFlights[index] = { ...newFlights[index], [field]: value };
      return newFlights;
    });
  };

  /**
   * Deletes a flight from the `flights` state array at a given index.
   * @param {number} indexToDelete - The index of the flight to remove.
   */
  const deleteFlight = (indexToDelete) => {
    setFlights(currentFlights => 
      currentFlights.filter((_, index) => index !== indexToDelete)
    );
  };


  // Once data is loaded, render the main editor form.
  return (
    <div className='editor_page_wrapper'>
      <h1>Editing: {tripData.trip_title}</h1>

      <form id="trip-editor-form" onSubmit={handleSubmit}>

        <Editor_Page_Card 
          tripData={tripData} 
          tripSummary={tripSummary} 
          setTripSummary={setTripSummary} 
          startDate={startDate} setStartDate={setStartDate} 
          endDate={endDate} 
          setEndDate={setEndDate} 
          tripImage={tripImage} 
          setTripImage={setTripImage} 
          tripTaken={tripTaken} 
          setTripTaken={setTripTaken} 
        />

        <Flight_Items flights={flights} handleFlightChange={handleFlightChange} addFlight={addFlight} deleteFlight={deleteFlight} />

        <div className='editor_page_submit'>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={cancelForm}>Cancel</button>
        </div>

      </form>
    </div>
  )
}

export default Editor_Page
