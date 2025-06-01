import React, { useEffect, useState } from 'react'
import Pageination from '../../../client/src/components/pagination/pageination';
import { Link } from 'react-router-dom';


const ITEMS_PER_PAGE =10;//How many Items are allowed per page


function Sidbar_blogs({posts}) {

    const [currentPage, setCurrentPage]=useState(1)
    const [postsPerPage]=useState(ITEMS_PER_PAGE)
    
 

    //Get Current Posts
    const indexOfLastPost =currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = posts.slice(indexOfFirstPost, indexOfLastPost)
    
    //Change Page
    const paginate = (pageNumber)=>setCurrentPage(pageNumber);

  return (
    <div>
        {currentPost.map((item)=>{
            return(
                <div key={item.id} className='mtu_sidbar_blogs_container'>
                    <Link 
                        className="navbar-brand travel-blog-header"  
                        to={`/movingtousa/${item.slug}`}
                          state={{ postData: posts }}     
                    >
                            <h4>{item.title}</h4>
                    </Link>
                    <p>{item.summary}</p>
                </div>
            )
        })}
        <div className='mtu_sidebar_div'>
            <Pageination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
        </div>
        
    </div>
  )
}

export default Sidbar_blogs
