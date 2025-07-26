import React, {useState, useEffect} from 'react'
import './Sample_Card.css'

function Sample_Card({item}) {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        // Check if trip_image is a File object (for new uploads)
        if (item?.trip_image instanceof File) {
            objectUrl = URL.createObjectURL(item.trip_image);
            setImagePreviewUrl(objectUrl);
        } else if (typeof item?.trip_image === 'string' && item.trip_image) {
            // If it's a string, it's an ID for an existing image. Construct the URL.
            setImagePreviewUrl(`https://api.wade-usa.com/assets/${item.trip_image}`);
        } else {
            // Reset if it's neither a file nor a string (e.g., null)
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
            <p>No image</p>
        )}

        {item.trip_title ? (
            <h2 className='trip_card_title'>{item.trip_title}</h2>
        ) : (
            <p>No title</p>
        )}

        {item.start_date && item.end_date ? (
            <h4 className='trip_card_dates'><i>{`From ${item.start_date} to ${item.end_date}`}</i></h4>
        ):(
            <p>No dates</p>
        )}
        
        {item.trip_summary ? (
            <p className='trip_card_summary'>{item.trip_summary}</p>
        ) : (
            <p>No summary</p>
        )}
        

    </div>
  )
}

export default Sample_Card