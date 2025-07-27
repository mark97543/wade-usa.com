import React from 'react'

/**
 * @component Events
 * @description Renders a list of editable event items for a trip.
 * @param {object} props - The component props.
 * @param {Array<object>} [props.events=[]] - An array of event objects to be displayed.
 * @param {Function} props.handleEventChange - Callback function to handle changes in any event input field.
 * @param {Function} props.addEvent - Callback function to add a new event to the list.
 * @param {Function} props.deleteEvent - Callback function to remove an event from the list.
 * @returns {React.ReactElement} The rendered event items section.
 */
function Events({ events = [], handleEventChange, addEvent, deleteEvent }) {
  return (
    <div className='editor_page_events'>
      <h2>Events</h2>
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={event.id || index} className="editor_page_event_item">
            <h4 id="event_number">Event {index + 1}</h4>
            <div className="editor_page_event_fields">
              <label htmlFor={`event-start-${index}`}>Start:</label>
              <input type="datetime-local" id={`event-start-${index}`} value={event.start ? event.start.slice(0, 16) : ''} onChange={(e) => handleEventChange(index, 'start', e.target.value)} />

              <label htmlFor={`event-name-${index}`}>Event Name:</label>
              <input type="text" id={`event-name-${index}`} value={event.event_name || ''} onChange={(e) => handleEventChange(index, 'event_name', e.target.value)} />

              <label htmlFor={`event-location-${index}`}>Location:</label>
              <textarea id={`event-location-${index}`} value={event.event_location || ''} onChange={(e) => handleEventChange(index, 'event_location', e.target.value)} rows="3" />

              <label htmlFor={`event-note-${index}`}>Note:</label>
              <textarea id={`event-note-${index}`} value={event.note || ''} onChange={(e) => handleEventChange(index, 'note', e.target.value)} rows="3" />
            </div>
            <div className='editor_page_event_item_remove'>
              <button type="button" onClick={() => deleteEvent(index)}>-</button>
            </div>
          </div>
        ))
      ) : (
        <h4>No Events</h4>
      )}
      <button id="add_event_button" type="button" onClick={addEvent}>Add Event</button>
    </div>
  )
}

export default Events