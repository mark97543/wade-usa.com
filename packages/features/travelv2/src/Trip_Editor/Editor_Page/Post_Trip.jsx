import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * @component Post_Trip
 * @description Renders a WYSIWYG editor for the trip's post-trip summary.
 * @param {object} props - The component props.
 * @param {string} props.postTripSummary - The HTML content for the editor.
 * @param {Function} props.setPostTripSummary - Callback to update the post-trip summary.
 * @returns {React.ReactElement} The rendered post-trip summary editor section.
 */
function Post_Trip({ postTripSummary, setPostTripSummary }) {
  return (
    <div className="editor_page_post_trip">
      <h2>Post-Trip Summary</h2>
      <p>Write a summary of how the trip went. This will be displayed after the trip is marked as "taken".</p>
      <ReactQuill
        theme="snow"
        value={postTripSummary}
        onChange={setPostTripSummary}
      />
    </div>
  );
}

export default Post_Trip;