import React, {useState, useEffect}from 'react'
import './Trip_Editor.css'
import {useNavigate} from 'react-router-dom'
import { createTripV2, makeSlug, fetchAllSlugs } from '@wade-usa/auth'





function Trip_Editor() {
    const navigate = useNavigate();

    const [tripTitle, setTripTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugs, setSlugs] = useState([]);
    const [tripSummary, setTripSummary] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    /* -------------------- Pulls in all slugs from database -------------------- */
    useEffect(() => {
        const loadSlugs = async () => {
            const slugs = await fetchAllSlugs();
            setSlugs(slugs);
        }
        loadSlugs();
    }, []);


    /* -------------------- Generates slug from trip title -------------------- */
    useEffect(() => {
        setSlug(makeSlug(tripTitle));
    }, [tripTitle]);


    /* ---------------------------- Clear form button --------------------------- */
    const clearForm = () => {
        setTripTitle('');
        setError(null);
    }

    /* --------------------------------- Submit --------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        if (slugs.includes(slug)) {
            setError('Error: Slug already exists, Change the title.');
            setIsSubmitting(false);
            return;
        }
        try {
            await createTripV2({ trip_title: tripTitle, 
                slug: slug,
                trip_summary: tripSummary });
            clearForm();
            navigate('/travel');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    /* ----------------- Cancels Edit and returns to Travel Home ---------------- */
    const cancelForm = () => {
        clearForm();
        navigate('/travel');
    }

  


  return (
    <div className="trip-editor">
        <h1>Enter the following information:</h1>

        <form onSubmit={handleSubmit}>
            
            <div className='trip-add-error-container'>
                {error && <p className="error-message">{error}</p>}
            </div>
            
            <div className="trip-editor-form-group">
                <label htmlFor="trip-title">Trip Title:</label>
                <input type="text" id="trip-title" maxLength="60" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} required disabled={isSubmitting}/>
                <p>Enter the trip name. It has to be unique and max 60 characters long. </p>

                <label htmlFor="summary">Enter Trip Summary:</label>
                <textarea id="summary" maxLength="200" rows="4" value={tripSummary} onChange={(e) => setTripSummary(e.target.value)} required disabled={isSubmitting}></textarea>
                <p>This is a breif summary of the trip. It is limited to 200 characters.</p>
            </div>

            <div className="trip-editor-submit-group">
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
                <button type="button" onClick={clearForm} disabled={isSubmitting}>Clear</button>
                <button type="button" onClick={cancelForm} disabled={isSubmitting}>Cancel</button>
            </div>

        </form>
        

    </div>
  )
}

export default Trip_Editor