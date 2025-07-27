import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageGalleryUploader from './Image_Gallery_Uploader';

/**
 * @component Post_Trip
 * @description Renders a WYSIWYG editor for the trip's post-trip summary and a gallery uploader.
 * @param {object} props - The component props.
 * @param {string} props.postTripSummary - The HTML content for the editor.
 * @param {Function} props.setPostTripSummary - Callback to update the post-trip summary.
 * @param {Array<File|object|string>} props.galleryImages - Array of images for the gallery.
 * @param {Function} props.setGalleryImages - Callback to update the gallery images array.
 * @returns {React.ReactElement} The rendered post-trip summary editor section.
 */
function Post_Trip({ postTripSummary, setPostTripSummary, galleryImages, setGalleryImages }) {
  return (
    <div className="editor_page_post_trip">
      <h2>Post-Trip Summary</h2>
      <p>Write a summary of how the trip went. This will be displayed after the trip is marked as "taken".</p>
      <ReactQuill
        theme="snow"
        value={postTripSummary}
        onChange={setPostTripSummary}
      />
      <ImageGalleryUploader
        galleryImages={galleryImages}
        setGalleryImages={setGalleryImages}
      />
    </div>
  );
}

export default Post_Trip;