import React, { useMemo, useRef } from 'react';
// We need to import Quill statically to register the image resize module.
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Post_Trip.css'; // Import custom styles for Quill
import { uploadEditorImage } from '@wade-usa/auth';
// Import the image resize module
import ImageResize from 'quill-image-resize-module-react';

// Register the module with Quill.
Quill.register('modules/imageResize', ImageResize);
/**
 * @component Post_Trip
 * @description Renders a WYSIWYG editor for the trip's post-trip summary.
 * @param {object} props - The component props.
 * @param {string} props.postTripSummary - The HTML content for the editor.
 * @param {Function} props.setPostTripSummary - Callback to update the post-trip summary.
 * @returns {React.ReactElement} The rendered post-trip summary editor section.
 */
function Post_Trip({ postTripSummary, setPostTripSummary }) {
  const quillRef = useRef(null);

  // Memoize the modules object to prevent re-renders, which is a best practice.
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        // This is the custom handler for the image button
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files[0];
            if (file && quillRef.current) {
              try {
                const imageUrl = await uploadEditorImage(file);
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection(true);
                editor.insertEmbed(range.index, 'image', imageUrl);
              } catch (error) {
                console.error('Image upload failed:', error);
                alert('Image upload failed. Please try again.');
              }
            }
          };
        },
      },
    },
    // Add the image resize module to Quill's modules.
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), []);

  return (
    <div className="editor_page_post_trip">
      <h2>Post-Trip Summary</h2>
      <p>Write a summary of how the trip went. This will be displayed after the trip is marked as "taken".</p>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={postTripSummary}
        onChange={setPostTripSummary}
        modules={modules}
      />
    </div>
  );
}

export default Post_Trip;