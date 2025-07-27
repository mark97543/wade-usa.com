import React, { useState, useEffect } from 'react';
import './Image_Gallery_Uploader.css';

/**
 * @component ImageGalleryUploader
 * @description A component for uploading and managing a gallery of images.
 * @param {object} props - The component props.
 * @param {Array<File|object|string>} props.galleryImages - Array of images (new Files, existing objects with id, or string ids).
 * @param {Function} props.setGalleryImages - Callback to update the gallery images array.
 * @returns {React.ReactElement}
 */
const ImageGalleryUploader = ({ galleryImages, setGalleryImages }) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const generatePreviews = () => {
      if (!galleryImages) return;

      const previews = galleryImages.map(fileOrObject => {
        if (fileOrObject instanceof File) {
          return {
            id: `${fileOrObject.name}-${fileOrObject.lastModified}`, // More stable temp id
            url: URL.createObjectURL(fileOrObject),
            isNew: true,
            file: fileOrObject
          };
        }
        if (typeof fileOrObject === 'object' && fileOrObject && fileOrObject.id) {
          return {
            id: fileOrObject.id,
            url: `https://api.wade-usa.com/assets/${fileOrObject.id}`,
            isNew: false
          };
        }
        if (typeof fileOrObject === 'string') {
          return {
            id: fileOrObject,
            url: `https://api.wade-usa.com/assets/${fileOrObject}`,
            isNew: false
          };
        }
        return null;
      }).filter(Boolean);

      setImagePreviews(previews);

      // This return function is the cleanup function for the effect.
      return () => {
        previews.forEach(preview => {
          if (preview.isNew) {
            URL.revokeObjectURL(preview.url);
          }
        });
      };
    };

    const cleanup = generatePreviews();
    return cleanup;
  }, [galleryImages]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length) {
      setGalleryImages(prevImages => [...(prevImages || []), ...newFiles]);
    }
  };

  const handleRemoveImage = (idToRemove) => {
    const previewToRemove = imagePreviews.find(p => p.id === idToRemove);
    if (!previewToRemove) return;

    if (previewToRemove.isNew) {
      // For new files, we filter out the specific File object.
      setGalleryImages(prev => prev.filter(item => item !== previewToRemove.file));
    } else {
      // For existing files, we filter by ID.
      setGalleryImages(prev => prev.filter(item => {
        if (typeof item === 'string') return item !== idToRemove;
        if (typeof item === 'object' && item && item.id) return item.id !== idToRemove;
        return true; // Keep File objects and other items
      }));
    }
  };

  return (
    <div className="image-gallery-uploader">
      <h3>Trip Gallery</h3>
      <p>Upload images for the trip gallery. These will be shown with the post-trip summary.</p>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif, image/webp"
        className="gallery-file-input"
      />
      <div className="gallery-previews">
        {imagePreviews.map((preview) => (
          <div key={preview.id} className="gallery-preview-item">
            <img src={preview.url} alt="Gallery preview" />
            <button className="remove-btn" onClick={() => handleRemoveImage(preview.id)} title="Remove image">
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryUploader;