import React from 'react'
import Sample_Card from '../sample_card/Sample_Card.jsx'

/**
 * A component that renders the form fields for editing the main "card" details of a trip.
 * This includes the summary, dates, image, and a checkbox to mark if the trip has been taken.
 * It also displays a live preview of the card using the Sample_Card component.
 *
 * @param {object} props - The component's props.
 * @param {object} props.tripData - The main data object for the trip, used for the title in the preview.
 * @param {string} props.tripSummary - The current value of the trip summary.
 * @param {function} props.setTripSummary - State setter function for the trip summary.
 * @param {string} props.startDate - The current value of the start date.
 * @param {function} props.setStartDate - State setter function for the start date.
 * @param {string} props.endDate - The current value of the end date.
 * @param {function} props.setEndDate - State setter function for the end date.
 * @param {File|string|null} props.tripImage - The current trip image (File object for new, string ID for existing).
 * @param {function} props.setTripImage - State setter function for the trip image.
 * @param {boolean} props.tripTaken - The current value of the "trip taken" checkbox.
 * @param {function} props.setTripTaken - State setter function for the "trip taken" checkbox.
 */
function Editor_Page_Card({ tripData, tripSummary, setTripSummary, startDate, setStartDate, endDate, setEndDate, tripImage, setTripImage, tripTaken, setTripTaken }) {
  return (
    <div className='editor_page_card'>
        <h1>Card Edit</h1>

        {/* Input for the trip's summary/description */}
        <label htmlFor="summary">Enter Trip Summary:</label>
        <textarea id="summary" maxLength="200" rows="4" value={tripSummary} onChange={(e) => setTripSummary(e.target.value)} required ></textarea>
        <p>This is a brief description of the trip. It is limited to 200 characters.</p>

        {/* Input for the trip's start date */}
        <label htmlFor="start-date">Start Date:</label>
        <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>

        {/* Input for the trip's end date */}
        <label htmlFor="end-date">End Date:</label>
        <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>

        {/* File input for uploading or replacing the trip's main image */}
        <label htmlFor="trip-image">Trip Image:</label>
        <input type="file" id="trip-image" onChange={(e) => setTripImage(e.target.files[0])} accept="image/*" />
        <p>Upload an image to represent the trip. Should be 3:2 aspect ratio. </p>

        {/* Checkbox to mark whether the trip has already been taken */}
        <label htmlFor="trip_taken">Trip Taken:</label>
        <input type="checkbox" id="trip_taken" checked={tripTaken} onChange={(e) => setTripTaken(e.target.checked)}/>

        {/* Live preview of the travel card */}
        <div className="trip-editor-sample-card">
            <h3>Sample Tile</h3>
            <Sample_Card item={{ trip_title: tripData?.trip_title, trip_summary: tripSummary, trip_image: tripImage, start_date: startDate, end_date: endDate }} />
        </div>
    </div>
  )
}

export default Editor_Page_Card