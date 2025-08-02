import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

/**
 * @component Post_Trip
 * @description Renders the post-trip summary and a photo gallery carousel.
 * @param {object} props - The component props.
 * @param {string} props.pts - The HTML content of the post-trip summary.
 * @param {Array<object>} props.images - An array of image objects for the carousel.
 * @returns {React.ReactElement} The rendered post-trip section.
 */
function Post_Trip({pts, images}) {
    // The console.log below is very useful! Check your browser's developer tools
    // to confirm the structure of the 'images' array. This implementation assumes
    // each 'image' object has an 'id' and a 'directus_files_id'.
    // console.log(images)

  // This component will only be rendered if there is a summary or images,
  // based on the logic in Slug.jsx.
  return (
    <div className='slug_post_trip_container'>
        <h2>Post-Trip Summary</h2>

        {/* This div will render the HTML content from the WYSIWYG editor. */}
        {pts && <div dangerouslySetInnerHTML={{ __html: pts }} />}

        {/* Only render the carousel if there are images */}
        {images && images.length > 0 && (
            <div className="post_trip_carousel_wrapper">
                <h3>Photo Gallery</h3>
                <Carousel 
                    showThumbs={false} 
                    infiniteLoop 
                    useKeyboardArrows 
                    autoPlay 
                    dynamicHeight={false}
                    showStatus={false} // This prop removes the "1 of 5" counter.
                >
                    {images.map(image => (
                        <div key={image.id}>
                            <img src={`https://api.wade-usa.com/assets/${image.directus_files_id.id}`} alt="Post-trip gallery" />
                        </div>
                    ))}
                </Carousel>
            </div>
        )}
    </div>
  )
}

export default Post_Trip