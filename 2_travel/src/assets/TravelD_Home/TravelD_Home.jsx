import React, { useState, useEffect } from 'react';
import './TravelD_Home.css';
import TravelCards from '../Travel Cards/TravelCards';
import Pagination from '@components/Paginnation/Pagination';
import axios from 'axios';

/// Setting up Directus Connection
const DIRECTUS_BASE_URL = import.meta.env.VITE_DIRECTUS_API_URL; 

const directusApi = axios.create({
    baseURL: DIRECTUS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // If your Directus uses HTTP-only cookies for refresh tokens
});

function TravelD_Home() {
  // State for raw data from API after initial fetch (or static data if no API)
  const [initialPosts, setInitialPosts] = useState([]); 
  // States for loading and error during API fetch
  const [loading, setLoading] = useState(true); // <-- DECLARED loading state
  const [error, setError] = useState(null);     // <-- DECLARED error state

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9); 

  const [searchTerm, setSearchTerm] = useState(''); 
  // State for posts after applying initial status filter and sorting
  const [statusFilteredAndSortedPosts, setStatusFilteredAndSortedPosts] = useState([]);
  // State for posts after applying search filter (final list for display)
  const [displayPosts, setDisplayPosts] = useState([]); 


  // Effect 1: Fetch data from Directus and apply initial status filter/sort
  useEffect(() => {
    const fetchAndProcessTrips = async () => {
      try {
        setLoading(true); // Set loading to true when starting fetch
        setError(null);   // Clear any previous errors

        const response = await directusApi.get('/items/travel_lvl1_list', { // Assuming your collection is 'travel_lvl1_list'
            params: {
                fields: 'id,trip_title,summary,image,date_created,auther,traveled,status,link',
            },
        });
        
        let fetchedData = response.data.data || []; 
        // console.log("Full Axios Response Object:", response); // Log the full response object as requested
        // console.log("Fetched Data Array (response.data.data):", fetchedData); // Log the actual data array

        // 1. Apply initial 'planning' status filter
        const pageFilter = 'planning'; // This is hardcoded for 'planning' trips
        let processedData = fetchedData.filter(post => post.status === pageFilter);

        // 2. Sort by 'created' date (newest first)
        processedData.sort((a, b) => {
          const dateA = new Date(a.created);
          const dateB = new Date(b.created);
          return dateB - dateA; // For newest first
        });

        setInitialPosts(fetchedData); // Store the raw fetched data (or static if fallback)
        setStatusFilteredAndSortedPosts(processedData); // Store initially filtered/sorted data
        
      } catch (err) {
        console.error('Error fetching trips from Directus:', err);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false once fetch/process is done
        setCurrentPage(1); // Always reset page on initial load or data change
      }
    };

    fetchAndProcessTrips();
  }, []); // Empty dependency array: runs only once on mount


  // Effect 2: Apply search filtering whenever searchTerm changes or 'statusFilteredAndSortedPosts' changes
  useEffect(() => {
    // --- Use statusFilteredAndSortedPosts as the base for filtering ---
    let currentFiltered = [...statusFilteredAndSortedPosts]; 

    // Apply search filter if searchTerm is not empty
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(post => {
        const titleMatch = post.trip_title && post.trip_title.toLowerCase().includes(lowercasedSearchTerm);
        const summaryMatch = post.summary && post.summary.toLowerCase().includes(lowercasedSearchTerm);
        return titleMatch || summaryMatch;
      });
    }

    setDisplayPosts(currentFiltered); // Set the final list of posts to be displayed
    setCurrentPage(1); // Reset to the first page whenever search term changes
  }, [searchTerm, statusFilteredAndSortedPosts]); // Rerun this effect when searchTerm or the base list changes


  // Get current posts for pagination from the final 'displayPosts'
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = displayPosts.slice(indexOfFirstPost, indexOfLastPost);


  // Change page handler for Pagination component
  const paginate = pageNumber => setCurrentPage(pageNumber);



  return (
    <div className='traveld_home_wrapper'>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search trips by title or summary..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="traveld_searchbar" // Ensure this class exists in TravelD_Home.css
      />

      {/* Loading and Error UI */}
      {loading && <div>Loading planning trips...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>}
      
      {/* Display posts only when not loading, no error, and there are posts */}
      {!loading && !error && displayPosts.length === 0 && (
        <div>No matching trips found.</div>
      )}

      {!loading && !error && displayPosts.length > 0 && (
        <>
          <div className='travel_card_wrapper'>
            {/* Map over currentPosts (which are paginated from displayPosts) */}
            {currentPosts.map((data) => (
              <TravelCards key={data.id} data={data} />
            ))}
          </div>

          <div className='travelhome_paginnation'>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={displayPosts.length}
              paginate={paginate}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default TravelD_Home;