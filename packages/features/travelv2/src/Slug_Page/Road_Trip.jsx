import React from 'react'

function Road_Trip({item}) {
    //console.log(item)
  return (
    <div className='slug_road_trip_container'>
        <h2>Road Trip</h2>
        <table className='slug_road_trip_table'>
            <thead>
                <tr>
                    <th className='slug_road_trip_table_cell_name'>Destination</th>
                    <th className='slug_road_trip_table_cell_cord'>Coordinates</th>
                    <th className='slug_road_trip_table_cell_note'>Note</th>
                </tr>
            </thead>
            <tbody>
                {item.map((item, index) => (
                    <tr key={index}>
                        <td className='slug_road_trip_table_cell_name'>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${item.long_lat}&travelmode=driving`} target='_blank' rel="noopener noreferrer">
                                {item.name}
                            </a>
                        </td>
                        <td className='slug_road_trip_table_cell_cord'>{item.long_lat}</td>
                        <td className='slug_road_trip_table_cell_note'>{item.note}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    
    </div>
  )
}

export default Road_Trip