import React, {useState} from 'react'
import './TravelD_Home.css'
import TravelCards from '../Travel Cards/TravelCards'
import Pagination from '@components/Paginnation/Pagination'

const Data =[
  {id: 1, link: 'google.com', image:"", summary: 'summary1', created: '06/14/25', auther:'Mark Wade', traveled: '06/14/25', status: 'taken', trip_title: 'My First Journey'},
  {id: 2, link: 'example.com/2', image:"", summary: 'Adventure in the Mountains', created: '03/01/24', auther:'Mark Wade', traveled: '02/28/24', status: 'taken', trip_title: 'Mountain Peaks Adventure'},
  {id: 3, link: 'example.com/3', image:"", summary: 'City Break in Paris', created: '09/10/23', auther:'Mark Wade', traveled: '09/05/23', status: 'archive', trip_title: 'Parisian Charm'},
  {id: 4, link: 'example.com/4', image:"", summary: 'Beach Escape', created: '11/20/24', auther:'Mark Wade', traveled: '11/18/24', status: 'planning', trip_title: 'Sunny Shores Getaway'},
  {id: 5, link: 'example.com/5', image:"", summary: 'Desert Expedition', created: '01/05/25', auther:'Mark Wade', traveled: '01/02/25', status: 'taken', trip_title: 'Desert Sands Trek'},
  {id: 6, link: 'example.com/6', image:"", summary: 'Forest Hiking', created: '07/18/23', auther:'Mark Wade', traveled: '07/15/23', status: 'archive', trip_title: 'Emerald Forest Hike'},
  {id: 7, link: 'example.com/7', image:"", summary: 'Cultural Tour', created: '04/22/24', auther:'Mark Wade', traveled: '04/20/24', status: 'hidden', trip_title: 'Ancient Wonders Tour'},
  {id: 8, link: 'example.com/8', image:"", summary: 'Island Hopping', created: '12/01/24', auther:'Mark Wade', traveled: '11/29/24', status: 'planning', trip_title: 'Tropical Island Journey'},
  {id: 9, link: 'example.com/9', image:"", summary: 'Snowy Mountains', created: '02/14/25', auther:'Mark Wade', traveled: '02/10/25', status: 'hidden', trip_title: 'Winter Mountain Escape'},
  {id: 10, link: 'example.com/10', image:"", summary: 'Riverside Camping', created: '08/03/23', auther:'Mark Wade', traveled: '08/01/23', status: 'archive', trip_title: 'Riverside Retreat'},
  {id: 11, link: 'example.com/11', image:"", summary: 'Historical Sites', created: '05/09/24', auther:'Mark Wade', traveled: '05/07/24', status: 'planning', trip_title: 'Journey Through History'},
  {id: 12, link: 'example.com/12', image:"", summary: 'Adventure Cycling', created: '10/25/23', auther:'Mark Wade', traveled: '10/20/23', status: 'taken', trip_title: 'Cross-Country Cycle'}
]

// This I going to be all the Trips planned 
function TravelD_Home() {
  const [posts, setPosts] = useState(Data);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);


  return (
    <div className='traveld_home_wrapper'>
      <div className='travel_card_wrapper'>
        {currentPosts.map((data)=>(
          <TravelCards key={data.id} data={data} />
        ))}
      </div>
      <div className='travelhome_paginnation'>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={paginate}
        />
      </div>
    </div>
  )
}



export default TravelD_Home
