import React, {useState, useEffect}from 'react'
import './Trip_Editor.css'
import {useNavigate} from 'react-router-dom'
// Import functions for creating a trip, generating a slug, and fetching existing slugs.
import { createTripV2, makeSlug, fetchAllSlugs } from '@wade-usa/auth'
import Sample_Card from './sample_card/Sample_Card'


function Trip_Editor() {
    // Hook for programmatic navigation.
    const navigate = useNavigate();

    // State for form inputs.
    const [tripTitle, setTripTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugs, setSlugs] = useState([]); // Holds all existing slugs from the database.
    const [tripSummary, setTripSummary] = useState('');
    const [tripImage, setTripImage] = useState(null)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // State for managing form submission process.
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    /* -------------------- Pulls in all slugs from database -------------------- */
    // On component mount, fetch all existing slugs to validate new slugs against.
    useEffect(() => {
        const loadSlugs = async () => {
            const slugs = await fetchAllSlugs();
            setSlugs(slugs);
        }
        loadSlugs();
    }, []);


    /* -------------------- Generates slug from trip title -------------------- */
    // Whenever the trip title changes, automatically generate a URL-friendly slug.
    useEffect(() => {
        setSlug(makeSlug(tripTitle));
    }, [tripTitle]);


    /* ---------------------------- Clear form button --------------------------- */
    // Resets all form fields and error messages to their initial state.
    const clearForm = () => {
        setTripTitle('');
        setTripSummary('');
        setTripImage(null);
        setError(null);
        setEndDate('');
        setStartDate('');
        // Also reset the form element itself to clear file inputs, etc.
        document.getElementById('trip-editor-form')?.reset();
    }

    /* --------------------------------- Submit --------------------------------- */
    // Handles the form submission event.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default browser form submission.
        setIsSubmitting(true);
        setError(null);

        // Validate that the generated slug is unique.
        if (slugs.includes(slug)) {
            setError('Error: Slug already exists, Change the title.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Call the API to create the new trip with the form data.
            await createTripV2({ trip_title: tripTitle, 
                slug: slug,
                trip_summary: tripSummary,
                trip_image: tripImage,
                start_date: startDate,
                end_date: endDate
            });
            clearForm(); // Clear the form on successful submission.
            // Navigate to the editor page for the newly created trip.
            navigate(`/travel/editor-page/${slug}`);
        } catch (error) {
            // If there's an error, display it to the user.
            setError(error.message);
        } finally {
            // Ensure the submitting state is reset regardless of success or failure.
            setIsSubmitting(false);
        }
    }

    /* ----------------- Cancels Edit and returns to Travel Home ---------------- */
    // Clears the form and navigates the user back to the main travel page.
    const cancelForm = () => {
        clearForm();
        navigate('/travel');
    }

  return (
    // Main container for the trip editor page.
    <div className="trip-editor">
        <h1>Enter the following information:</h1>

        {/* The main form for creating a new trip. */}
        <form onSubmit={handleSubmit} id="trip-editor-form">
            
            {/* Container for displaying any submission errors. */}
            <div className='trip-add-error-container'>
                {error && <p className="error-message">{error}</p>}
            </div>
            
            {/* Grouping for the main form fields. */}
            <div className="trip-editor-form-group">
                <label htmlFor="trip-title">Trip Title:</label>
                <input type="text" id="trip-title" maxLength="60" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} required disabled={isSubmitting}/>
                <p>Enter the trip name. It has to be unique and max 60 characters long. </p>

                <label htmlFor="summary">Enter Trip Summary:</label>
                <textarea id="summary" maxLength="200" rows="4" value={tripSummary} onChange={(e) => setTripSummary(e.target.value)} required disabled={isSubmitting}></textarea>
                <p>This is a brief description of the trip. It is limited to 200 characters.</p>


                <label htmlFor="start-date">Start Date:</label>
                <input type="date" id="start-date" disabled={isSubmitting} onChange={(e) => setStartDate(e.target.value)}/>

                <label htmlFor="end-date">End Date:</label>
                <input type="date" id="end-date" disabled={isSubmitting} onChange={(e) => setEndDate(e.target.value)}/>
                    

                <label htmlFor="trip-image">Trip Image:</label>
                <input
                    type="file"
                    id="trip-image"
                    onChange={(e) => setTripImage(e.target.files[0])}
                    accept="image/*"
                    disabled={isSubmitting}
                />
                <p>Upload an image to represent the trip. Should be 3:2 aspect ratio</p>


            </div>

            {/* Grouping for the form action buttons. */}
            <div className="trip-editor-submit-group">
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
                <button type="button" onClick={clearForm} disabled={isSubmitting}>Clear</button>
                <button type="button" onClick={cancelForm} disabled={isSubmitting}>Cancel</button>
            </div>

            {/* A live preview of what the trip card will look like. */}
            <div className="trip-editor-sample-card">
                <h3>Sample Tile</h3>
                <Sample_Card item={{ trip_title: tripTitle, trip_summary: tripSummary, trip_image: tripImage, start_date: startDate, end_date: endDate }} />
            </div>

        </form>
        

    </div>
  )
}

export default Trip_Editor
