//blogs/moving_to_usa/Moving_USA_Blog.jsx

import React, {useEffect, useRef, useState} from 'react'
import './Moving_USA_Blog.css'
import Sidebar_MTU from './page_components/sidebar'
import directusClient from '../../client/src/lib/directus';
import { readItems } from '@directus/sdk';



function Moving_USA_Blog() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLLECTION_NAME = 'moving_usa_blog'

  useEffect(()=>{
      async function fetchPosts(){
          setLoading(true)
          try{
              const fetchedPosts = await directusClient.request(
                  readItems(COLLECTION_NAME, {
                      feilds:[
                          'title',
                          'slug',
                          'status',
                          'update',
                          'summary',
                          'id',
                          'content',
                      ],
                      filter:{
                          status:{_eq:'deploy'}
                      },
                      sort:['title']
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
      
  },[COLLECTION_NAME])

  if (loading) {
      return <p>Loading posts...</p>;
  }

  if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (posts.length === 0) {
      return <p>No published posts found yet.</p>;
  }


  return (
    <div className='MTU_WRAPPER'>
      <Sidebar_MTU posts={posts}/>
      <div className='mtu_cont_container'>
        <h1>Hello Fa!</h1>
        <h4> Congradulations on moving to the USA. There are many things here that are different. These Blogs are here to help you transition to moving to the USA and hopefully eliminate some confusion.</h4>
        <h4>Select or search for a Item in the left Side Bar to Review it. </h4>

        <div className="mtu-blog-video-container">
          <video
              preload="metadata" // Helps load dimensions/duration quickly
              autoPlay
              loop
              muted
              playsInline
          >
              <source src='https://wade-usa.com/directus/assets/68c86c98-ef99-4e57-9f9d-a1e7ec3d59a5?cache-buster=2025-06-01T00:41:09.372Z&key=system-large-contain' type="video/mp4" />
              Your browser does not support the video tag. Please update your browser.
          </video>
        </div>
      </div>
    </div>
  )
}

export default Moving_USA_Blog
