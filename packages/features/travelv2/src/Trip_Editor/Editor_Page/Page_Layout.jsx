import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * @component Page_Layout
 * @description Renders a WYSIWYG editor for the trip's long summary/page layout.
 * @param {object} props - The component props.
 * @param {string} props.longSummary - The HTML content for the editor.
 * @param {Function} props.setLongSummary - Callback to update the long summary.
 * @param {string | File} props.bannerPicture - The current banner picture URL or File object.
 * @param {Function} props.setBannerPicture - Callback to update the banner picture.
 * @returns {React.ReactElement} The rendered page layout editor section.
 */
function Page_Layout({ longSummary, setLongSummary, bannerPicture, setBannerPicture }) {
  const handleBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerPicture(e.target.files[0]);
    }
  };

  const getBannerPreviewUrl = () => {
    if (bannerPicture instanceof File) {
      // A new file has been selected for upload.
      return URL.createObjectURL(bannerPicture);
    }
    if (typeof bannerPicture === 'string') {
      // An existing image ID from the server.
      return `https://api.wade-usa.com/assets/${bannerPicture}`;
    }
    return null;
  };
  const bannerPreviewUrl = getBannerPreviewUrl();

  return (
    <div className="editor_page_layout">
      <h2>Page Layout</h2>
      <div className="editor_page_banner_section">
        <label htmlFor="banner-picture-upload">Banner Picture</label>
        <p>This image will be displayed at the top of your trip page. (Recommended 5:1 ratio)</p>
        <input type="file" id="banner-picture-upload" accept="image/*" onChange={handleBannerChange} />
        {bannerPreviewUrl && (
          <div className="editor_page_banner_preview">
            <p>Current Banner:</p>
            <img src={bannerPreviewUrl} alt="Banner Preview" />
          </div>
        )}
      </div>
      <p>Use the editor below to create a detailed description or story for your trip.</p>
      <ReactQuill
        theme="snow"
        value={longSummary}
        onChange={setLongSummary}
      />
    </div>
  );
}

export default Page_Layout;