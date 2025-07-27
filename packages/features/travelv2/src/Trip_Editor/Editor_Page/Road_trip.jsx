import React, { useRef } from 'react';

/**
 * @component Road_trip
 * @description Renders a list of editable road trip stops with drag-and-drop reordering.
 * @param {object} props - The component props.
 * @param {Array<object>} [props.roadTripStops=[]] - An array of road trip stop objects.
 * @param {Function} props.handleRoadTripChange - Callback for input changes.
 * @param {Function} props.addRoadTripStop - Callback to add a new stop.
 * @param {Function} props.deleteRoadTripStop - Callback to remove a stop.
 * @param {Function} props.handleRoadTripReorder - Callback to reorder stops.
 * @returns {React.ReactElement} The rendered road trip items section.
 */
function Road_trip({ roadTripStops = [], handleRoadTripChange, addRoadTripStop, deleteRoadTripStop, handleRoadTripReorder }) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.target.classList.add('dragging');
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      handleRoadTripReorder(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className='editor_page_road_trip'>
      <h2>Road Trip</h2>
      <div className='editor_page_road_trip_list'>
        {roadTripStops.length > 0 ? (
          roadTripStops.map((stop, index) => (
            <div
              key={stop.id || index}
              className="editor_page_road_trip_item"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="drag-handle">⠿</div>
              <div className="stop-number">{index + 1}</div>
              <div className="editor_page_road_trip_fields">
                <label htmlFor={`roadtrip-name-${index}`}>Name:</label>
                <input type="text" id={`roadtrip-name-${index}`} value={stop.name || ''} onChange={(e) => handleRoadTripChange(index, 'name', e.target.value)} />

                <label htmlFor={`roadtrip-long-lat-${index}`}>Coordinates (Long, Lat):</label>
                <input type="text" id={`roadtrip-long-lat-${index}`} value={stop.long_lat || ''} onChange={(e) => handleRoadTripChange(index, 'long_lat', e.target.value)} placeholder="e.g., -74.0060, 40.7128" />

                <label htmlFor={`roadtrip-note-${index}`}>Note:</label>
                <textarea id={`roadtrip-note-${index}`} value={stop.note || ''} onChange={(e) => handleRoadTripChange(index, 'note', e.target.value)} rows="3" />
                <div className='editor_page_road_trip_item_remove'>
                  <button type="button" onClick={() => deleteRoadTripStop(index)}>-</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h4>No Road Trip Stops</h4>
        )}
      </div>
      <button id="add_road_trip_button" type="button" onClick={addRoadTripStop}>Add Stop</button>
    </div>
  );
}

export default Road_trip;