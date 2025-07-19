import React, {useState, useEffect} from 'react'
import './Travel_Home.css'
import {fetchAllTrips} from '@wade-usa/auth'
import Travel_Card from '../Travel_Card/Travel_Card';
import {Pagination} from '@repo/ui'


function Travel_Home() {
  const [loading, setLoading] = useState(true);

  //Pagnation constants
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  //Search Variables
  const [searchTerm, setSearchTerm] = useState('');
  // State for all trips (unfiltered)
  const [allTrips, setAllTrips] = useState([]);
  // State for posts to be displayed after search and pagination
  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(()=>{
    const loadTrips = async ()=>{
      const tripData = await fetchAllTrips();
      // Filters for future trips only.
      const tripsNotTaken = tripData.filter(trip => trip.trip_taken === false);
      setLoading(false);  // Set loading to false once data is loaded
      setAllTrips(tripsNotTaken);
      setDisplayPosts(tripsNotTaken); // Initially, display all untaken trips
    }
    loadTrips();
  }, [])

  //Apply search filtering whenever searchTerm changes
  useEffect(() => {
    let filteredTrips = [...allTrips];

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filteredTrips = allTrips.filter(post => {
        const titleMatch = post.trip_title && post.trip_title.toLowerCase().includes(lowercasedSearchTerm);
        const summaryMatch = post.summary && post.summary.toLowerCase().includes(lowercasedSearchTerm);
        return titleMatch || summaryMatch;
      });
    }

    setDisplayPosts(filteredTrips);
    setCurrentPage(1); // Reset to the first page whenever search term changes
  }, [searchTerm, allTrips]);

  // Get current posts for pagination from the displayPosts state
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = displayPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);


  if(loading){
    return <div>Loading Trips...</div>
  }

  return (
    <div className='travel_home_wrapper'>

      <div className='travel_home_input'>
        <input
          type="text"
          placeholder="Search trips by title or summary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="traveld_searchbar"
        />
      </div>

      <div className='travel_home_posts'>
        {currentPosts.map((trip)=>(
          <Travel_Card key={trip.id} item={trip} />
        ))}
      </div>

      <div className='travel_home_pagnation'>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={displayPosts.length}
          paginate={paginate}
        />
      </div>

    </div>
  )
}

export default Travel_Home