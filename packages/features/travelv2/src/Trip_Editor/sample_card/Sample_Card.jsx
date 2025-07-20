import React, {useState, useEffect} from 'react'
import './Sample_Card.css'

function Sample_Card({item}) {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        // Check if trip_image is a File object
        if (item?.trip_image instanceof File) {
        objectUrl = URL.createObjectURL(item.trip_image);
        setImagePreviewUrl(objectUrl);
        } else {
        // Reset if it's not a file (e.g., null)
        setImagePreviewUrl(null);
        }

        // Cleanup function to revoke the object URL when the component unmounts or the image changes
        return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
        };
    }, [item?.trip_image]);

  return (
    <div className='travel_card_box'>
        {imagePreviewUrl ? (
            <img className='trip_card_image' src={imagePreviewUrl} alt="Trip preview" />
        ) : (
            ""
        )}

        {item.trip_title ? (
            <h2 className='trip_card_title'>{item.trip_title}</h2>
        ) : (
            ""
        )}

        {item.start_date && item.end_date ? (
            <h4 className='trip_card_dates'><i>{`From ${item.start_date} to ${item.end_date}`}</i></h4>
        ):(
            ""
        )}
        
        {item.trip_summary ? (
            <p className='trip_card_summary'>{item.trip_summary}</p>
        ) : (
            ""
        )}
        

    </div>
  )
}

export default Sample_Card