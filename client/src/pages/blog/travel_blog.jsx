//client/src/pages/blog/travel_blog.jsx    import React from 'react';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import directusClient from '../../lib/directus'; // Adjust path if your directus.js is elsewhere
import { readItems } from '@directus/sdk';
import './travel_blog.css'
import Pageination from '../../components/pagination/pageination';

const ITEMS_PER_PAGE =10;//How many Items are allowed per page

function BlogPage() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage]=useState(1)
    const [postsPerPage]=useState(ITEMS_PER_PAGE)

    
    const COLLECTION_NAME = 'travel'

    useEffect(()=>{
        async function fetchPosts() {
            setLoading(true)
            try{
                const fetchedPosts = await directusClient.request(
                    readItems(COLLECTION_NAME, {
                        //request only fields I need for list view
                        fields:[
                            'title',
                            'slug',
                            'id',
                            'trip_summary',
                            'intro_image',
                            'intro_image.id',
                        ],
                        filter:{
                            status:{_eq:'published'},
                        },
                        sort:['title'],
                    })
                )
                setPosts(fetchedPosts)
                setError(null)
            }catch(err){
                console.error(`Failed to fetch items from ${COLLECTION_NAME}:`, err);
                setError(`Failed to load items. Please try again later. Error: ${err.message}`);
            }finally{
                setLoading(false)
            }
        }
        fetchPosts();
    }, [COLLECTION_NAME])

    if (loading) {
        return <p>Loading posts...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (posts.length === 0) {
        return <p>No published posts found yet.</p>;
    }

    //Get Current Posts
    const indexOfLastPost =currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = posts.slice(indexOfFirstPost, indexOfLastPost)
    
    //Change Page
    const paginate = (pageNumber)=>setCurrentPage(pageNumber);

    return(
        <div className='main-travel-blog'>
        {/*Need to add map function to add the list of items */}
            {currentPost.map((item)=>{
                // Construct image URL safely, checking if intro_image and its id exist
                const imageUrl = item.intro_image && item.intro_image.id
                    ? `${directusClient.url}/assets/${item.intro_image.id}?width=300&quality=80&format=webp` // Added format=webp for optimization
                    : 'https://placehold.co/300x200/e0e0e0/757575?text=No+Image'; // Fallback if no image

                return(
                    <div key={item.id} className='travel-blog-summary-container'>
                         <Link className="navbar-brand travel-blog-header"  to={`/blog/${item.slug}`}><h3>{item.title}</h3></Link>
                         <div className='travel-blog-summary-inner-container'>
                            {item.intro_image && item.intro_image.id &&(
                                <img className='travel-blog-initialimage' src={imageUrl} alt=""></img>
                            )}
                            <p className='travel-blog-summary'>{item.trip_summary}</p>
                         </div>

                         
                    </div>
                )
            })}
            <Pageination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
        </div>
    )
}
export default BlogPage;

    