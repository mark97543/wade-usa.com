import React, {useState, useEffect}from 'react'
import './Trip_Editor.css'
import {useNavigate} from 'react-router-dom'
import { createTripV2, makeSlug, fetchAllSlugs } from '@wade-usa/auth'
import Sample_Card from './sample_card/Sample_Card'






function Trip_Editor() {
    const navigate = useNavigate();

    const [tripTitle, setTripTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugs, setSlugs] = useState([]);
    const [tripSummary, setTripSummary] = useState('');
    const [tripImage, setTripImage] = useState(null)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
        setTripSummary('');
        setTripImage(null);
        setError(null);
        setEndDate('');
        setStartDate('');
        document.getElementById('trip-editor-form')?.reset();
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
                trip_summary: tripSummary,
                trip_image: tripImage,
                start_date: startDate,
                end_date: endDate
            });
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

        <form onSubmit={handleSubmit} id="trip-editor-form">
            
            <div className='trip-add-error-container'>
                {error && <p className="error-message">{error}</p>}
            </div>
            
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

            <div className="trip-editor-submit-group">
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
                <button type="button" onClick={clearForm} disabled={isSubmitting}>Clear</button>
                <button type="button" onClick={cancelForm} disabled={isSubmitting}>Cancel</button>
            </div>

            <div className="trip-editor-sample-card">
                <h3>Sample Tile</h3>
                <Sample_Card item={{ trip_title: tripTitle, trip_summary: tripSummary, trip_image: tripImage, start_date: startDate, end_date: endDate }} />
            </div>

        </form>
        

    </div>
  )
}

export default Trip_Editor

