import React, {useState, useEffect} from 'react'
import {useAuth} from '@wade-usa/auth'
import {useNavigate} from 'react-router-dom'
import './Travel_Home.css'
import {fetchAllTrips} from '@wade-usa/auth'
import Travel_Cards from './Travel_Cards/Travel_Cards'
import {Pagination} from '@repo/ui'




function Travel_Home() {

  const {user, isLoggedIn} = useAuth()
  const allowedRoles = ['Administrator','Basic']
  const navigate = useNavigate()
  const [tripData, setTripData] = useState([])

  /* ---------------------------- Pagination Items ---------------------------- */
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);


  //Navigate to Trip Editor 
  const handleAddTrip=()=>{
    navigate('trip-editor')
  }

  /* ----------------------------- Search Function ---------------------------- */
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    let filteredPosts = [...tripData];

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filteredPosts = tripData.filter(post => {
        const titleMatch = post.trip_title && post.trip_title.toLowerCase().includes(lowercasedSearchTerm);
        const summaryMatch = post.trip_summary && post.trip_summary.toLowerCase().includes(lowercasedSearchTerm);
        return titleMatch || summaryMatch;
      });
    }

    setPosts(filteredPosts);
    setCurrentPage(1); // Reset to the first page whenever search term changes
  }, [searchTerm, tripData]);

  

  /* -------------------- Pull all triup data on page loade ------------------- */
  useEffect(() => {
    const fetchTrips = async () => {
      const trips = await fetchAllTrips();
      const tripsNotTaken = trips.filter(trip => trip.trip_taken === false); //Filter Based on Trips Not Taken
      setTripData(tripsNotTaken);
      setPosts(tripsNotTaken);
    }
    fetchTrips();
  }, [])

  console.log(tripData)


  return (
    <div className='travel-home-container'>
      <h1>Upcomming Trips</h1>

      <div className='travel_home_input'>
        <input
          type="text"
          placeholder="Search trips by title or summary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="traveld_searchbar"
        />
      </div>

      {isLoggedIn && allowedRoles.includes(user?.role?.name) ? <button onClick={handleAddTrip}>Add Trip</button> : ""}

      <div className='travel_home_travel_cards'>
        {currentPosts.map((item, index) => (
          <Travel_Cards key={index} item={item} />
        ))}
      </div>

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
      />

    </div>

  )
}

export default Travel_Home




//TODO: Need to test when there are no trips
