    // client/src/pages/blog/blogpostpage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import directusClient from '../../lib/directus';// Adjust path if your directus.js is elsewhere
import { readItems } from '@directus/sdk';
import Table_Dep_Flights from './Tables/Table_Dep_Flights';
import Table_Ret_Flights from './Tables/Table_Ret_Flights';
import Table_Rentals from './Tables/Table_Rentals';
import Table_Hotels from './Tables/Table_Hotels';


function BlogPostPage() {
    const [post, setPost]=useState([])
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)
    const {slug} = useParams()
    const [hideTable, setHideTable]=useState(false)

    const COLLECTION_NAME = 'travel'
      // The name of the O2M field on your 'travel' collection that links to 'flights'.
    const FLIGHTS_RELATIONAL_FIELD_NAME = 'flights_in_trip'; 
    const RENTAL_CARS = 'travel_car_rental'
    const HOTELS = 'travel_hotels'

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
                            `${FLIGHTS_RELATIONAL_FIELD_NAME}.*`, // Use the defined constant
                            `${RENTAL_CARS}.*`,
                            `${HOTELS}.*`,
                            
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

    useEffect(()=>{ //This will format the Itin table and only display the header if data exists. 

        let tester = 0;

        if(!post ||!Array.isArray(post) || post.length === 0){
            return
        }

        if (!post[0].flights_in_trip || !Array.isArray(post[0].flights_in_trip) || post[0].flights_in_trip.length === 0) {
            tester ++
        }else{
            tester = -100;
        }

        if (!post[0].travel_hotels || !Array.isArray(post[0].travel_hotels) || post[0].travel_hotels.length === 0) {
            tester ++
        }else{
            tester = -100;
        }

        if(!post[0].travel_car_rental || !Array.isArray(post[0].travel_car_rental) || post[0].travel_car_rental.length===0){
            tester ++
        }else{
            tester = -100;
        }



        if(tester > 0){
            setHideTable(true)
        }else{
            setHideTable(false)
        }


    }, [post])

    if(loading){
        return <p>Loading post ...</p>
    }

    if(error){
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    // If post is still null after loading and no error specifically handled above,
    // it means it wasn't found or wasn't published.
    if (!post) {
        return <p>Blog post not found or not available.</p>;
    }

    const createMarkup = (htmlString) => {
        return { __html: htmlString || '' }; // Ensure htmlString is not null/undefined
    };



    return(
        <div className='post-container'>
            <h1>{post[0].title}</h1>
            <div>{post[0].trip_summary}</div>
            <div className='post-travel-blog-entire' dangerouslySetInnerHTML={createMarkup(post[0].travel_blog)} />
            <h1 hidden={hideTable}>Trip Itinerary</h1>
            <Table_Dep_Flights flights={post[0].flights_in_trip}/>
            <Table_Rentals rentals={post[0].travel_car_rental}/>
            <Table_Hotels hotels={post[0].travel_hotels}/>
            <Table_Ret_Flights flights={post[0].flights_in_trip}/>
        </div>
    )

}
export default BlogPostPage;
