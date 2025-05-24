    // client/src/pages/blog/blogpostpage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import directusClient from '../../lib/directus';// Adjust path if your directus.js is elsewhere
import { readItems } from '@directus/sdk';


function BlogPostPage() {
    const [post, setPost]=useState([])
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)
    const {slug} = useParams()

    const COLLECTION_NAME = 'travel'

    useEffect(()=>{
        async function fetchPost() {
            setLoading(true)
            try{
                const fetchedPost = await directusClient.request(
                    readItems(COLLECTION_NAME,{
                        fields:[
                            'title',
                            'slug',
                            'id',
                            'trip_summary',
                            'intro_image',
                            'intro_image.id', 
                            'travel_blog',
                        ],
                        filter:{
                            slug:{_eq:slug}
                        }
                    })
                )
                setPost(fetchedPost)
                setError(null)
            }catch(err){
                console.error(`Failed to fetch items from ${COLLECTION_NAME}:`, err)
                setError(`Failed to load items. Please try again later. Error: ${err.message}`);
            }finally{
                setLoading(false)
            }
        }
        fetchPost()
    },[slug, COLLECTION_NAME])

    if(loading){
        return <p>Loading post ...</p>
    }

    if(error){
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (post.length === 0) {
        return <p>No published posts found yet.</p>;
    }

    console.log(post)
    return(
        <div className='post-container'>
            <h1>{post[0].title}</h1>
            {post[0].trip_summary}
        </div>
    )

}
export default BlogPostPage;
