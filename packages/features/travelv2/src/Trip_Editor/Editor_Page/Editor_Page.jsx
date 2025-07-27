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
import Hotel_Items from './Hotel_Items.jsx';
import Rental_Cars from './Rental_Cars.jsx';
import Events from './Events.jsx';
import Road_trip from './Road_trip.jsx';
import { useItemManager } from './useItemManager.js';

function Editor_Page() {
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

  // Use the custom hook to manage flights, hotels, and rental cars
  const { items: flights, setItems: setFlights, addItem: addFlight, deleteItem: deleteFlight, handleItemChange: handleFlightChange } = useItemManager([]);
  const { items: hotels, setItems: setHotels, addItem: addHotel, deleteItem: deleteHotel, handleItemChange: handleHotelChange } = useItemManager([]);
  const { items: rentalCars, setItems: setRentalCars, addItem: addRentalCar, deleteItem: deleteRentalCar, handleItemChange: handleRentalCarChange } = useItemManager([]);
  const { items: events, setItems: setEvents, addItem: addEvent, deleteItem: deleteEvent, handleItemChange: handleEventChange } = useItemManager([]);
  const { items: roadTripStops, setItems: setRoadTripStops, addItem: addRoadTripStop, deleteItem: deleteRoadTripStop, handleItemChange: handleRoadTripChange } = useItemManager([]);

  // Store the initial state of related items to detect deletions on submit.
  const [initialFlights, setInitialFlights] = useState([]);
  const [initialHotels, setInitialHotels] = useState([]);
  const [initialRentalCars, setInitialRentalCars] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [initialRoadTripStops, setInitialRoadTripStops] = useState([]);

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
        // Populate hotels from the fetched trip data, sorting by check-in date.
        const sortedHotels = (trip.hotels || []).sort((a, b) => new Date(a.check_in) - new Date(b.check_in));
        setHotels(sortedHotels);
        setInitialHotels(sortedHotels);
        // Populate rental cars from the fetched trip data, sorting by pickup date.
        const sortedRentalCars = (trip.rental_cars || []).sort((a, b) => new Date(a.pickup_date) - new Date(b.pickup_date));
        setRentalCars(sortedRentalCars);
        setInitialRentalCars(sortedRentalCars);
        // Populate events from the fetched trip data, sorting by start date.
        const sortedEvents = (trip.events || []).sort((a, b) => new Date(a.start) - new Date(b.start));
        setEvents(sortedEvents);
        setInitialEvents(sortedEvents);
        // Populate road trip stops from fetched data, sorting by stop number.
        const sortedRoadTripStops = (trip.roadtrip || []).sort((a, b) => a.stop - b.stop);
        setRoadTripStops(sortedRoadTripStops);
        setInitialRoadTripStops(sortedRoadTripStops);
        setTripTaken(trip.trip_taken);
      }
    };
    fetchTrip();
  }, [tripID]); // Dependency array ensures this runs only when tripID changes.

  /**
   * A helper function to prepare the payload for related items (flights, hotels, etc.).
   * It identifies which items are to be created, updated, or deleted.
   * @param {Array} currentItems - The current state of items from the form.
   * @param {Array} initialItems - The initial state of items when the page loaded.
   * @returns {{payload: Array, deletedIds: Array}}
   */
  const prepareRelatedItemsPayload = (currentItems, initialItems) => {
    const createdItems = currentItems
      .filter(item => String(item.id).startsWith('new-'))
      .map(({ id, ...data }) => data);

    const updatedItems = currentItems.filter(item => !String(item.id).startsWith('new-'));

    const currentItemIds = new Set(updatedItems.map(item => item.id));
    const deletedIds = initialItems
      .filter(item => !currentItemIds.has(item.id))
      .map(item => item.id);

    const payload = [...createdItems, ...updatedItems];
    return { payload, deletedIds };
  };

  /**
   * Handles the form submission.
   * It constructs a payload for updating the trip and its related flights,
   * including creating new flights, updating existing ones, and deleting removed ones.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use the helper to prepare payloads for each item type
    const { payload: flightsPayload, deletedIds: deletedFlightIds } = prepareRelatedItemsPayload(flights, initialFlights);
    const { payload: hotelsPayload, deletedIds: deletedHotelIds } = prepareRelatedItemsPayload(hotels, initialHotels);
    const { payload: rentalCarsPayload, deletedIds: deletedRentalCarIds } = prepareRelatedItemsPayload(rentalCars, initialRentalCars);
    const { payload: eventsPayload, deletedIds: deletedEventIds } = prepareRelatedItemsPayload(events, initialEvents);
    const { payload: roadTripPayload, deletedIds: deletedRoadTripIds } = prepareRelatedItemsPayload(roadTripStops, initialRoadTripStops);

    // --- Main Trip Data Payload ---
    const tripUpdateData = {
      trip_summary: tripSummary,
      start_date: startDate,
      end_date: endDate,
      flights: flightsPayload,
      hotels: hotelsPayload,
      rental_cars: rentalCarsPayload,
      events: eventsPayload,
      roadtrip: roadTripPayload, 
      trip_taken: tripTaken,
    };

    // Conditionally add the trip image to the payload.
    // If it's a File object, it's a new upload. Otherwise, we don't send it,
    // and the existing image on the server remains unchanged.
    if (tripImage instanceof File) {
      tripUpdateData.trip_image = tripImage;
    }

    // Consolidate all items to be deleted into a single object.
    // This makes the API call more scalable for future related items.
    const deletedItems = {
      flights: deletedFlightIds,
      hotels: deletedHotelIds,
      rental_cars: deletedRentalCarIds,
      events: deletedEventIds,
      roadtrip: deletedRoadTripIds,
    };

    try {
      await updateTripV2(tripData.id, tripUpdateData, deletedItems);
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
   * Wrappers for the `addItem` hook function to provide specific templates.
   */
  const addNewFlight = () => addFlight({
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
  });

  const addNewHotel = () => addHotel({
      hotel_name: '',
      hotel_address: '',
      checkin: null,
      checkout: null,
      note: '',
  });

  const addNewRentalCar = () => addRentalCar({
      company: '',
      pickup_location: '',
      dropoff_location: '',
      pickup_date: null,
      dropoff_date: null,
      note: '',
  });

  const addNewEvent = () => addEvent({
      start: null,
      event_name: '',
      event_location: '',
      note: '',
  });

  const addNewRoadTripStop = () => addRoadTripStop({
    stop: roadTripStops.length + 1,
    name: '',
    long_lat: '',
    note: '',
  });

  /**
   * Reorders road trip stops after a drag-and-drop operation and updates stop numbers.
   * @param {number} startIndex - The original index of the dragged item.
   * @param {number} endIndex - The new index for the dropped item.
   */
  const handleRoadTripReorder = (startIndex, endIndex) => {
    const reorderedStops = Array.from(roadTripStops);
    const [removed] = reorderedStops.splice(startIndex, 1);
    reorderedStops.splice(endIndex, 0, removed);

    // Update the 'stop' number for each item based on its new position
    const updatedStops = reorderedStops.map((item, index) => ({ ...item, stop: index + 1 }));

    setRoadTripStops(updatedStops);
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

        <Flight_Items flights={flights} handleFlightChange={handleFlightChange} addFlight={addNewFlight} deleteFlight={deleteFlight} />
        <hr className='editor_page_hr'></hr>
        <Hotel_Items 
          hotels={hotels} 
          handleHotelChange={handleHotelChange} 
          addHotel={addNewHotel} 
          deleteHotel={deleteHotel} 
        />
        <hr className='editor_page_hr'></hr>
        <Rental_Cars
          rentalCars={rentalCars}
          handleRentalCarChange={handleRentalCarChange}
          addRentalCar={addNewRentalCar}
          deleteRentalCar={deleteRentalCar}
        />
        <hr className='editor_page_hr'></hr>
        <Events
          events={events}
          handleEventChange={handleEventChange}
          addEvent={addNewEvent}
          deleteEvent={deleteEvent}
        />
        <hr className='editor_page_hr'></hr>
        <Road_trip
          roadTripStops={roadTripStops}
          handleRoadTripChange={handleRoadTripChange}
          addRoadTripStop={addNewRoadTripStop}
          deleteRoadTripStop={deleteRoadTripStop}
          handleRoadTripReorder={handleRoadTripReorder}
        />
        <hr className='editor_page_hr'></hr>

        <div className='editor_page_submit'>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={cancelForm}>Cancel</button>
        </div>

      </form>
    </div>
  )
}

export default Editor_Page;
