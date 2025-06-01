import React, { useEffect, useState } from 'react';
import Sidebar_MTU from './page_components/sidebar'
import { useParams, useLocation } from 'react-router-dom';
import '../moving_to_usa/tipocs.css'


function MTU_Post_page() {
    
    const { slug } = useParams(); // Slug from URL
    const location = useLocation();
    const [allPosts, setAllPosts] = useState(location.state?.postData || null); // Renamed for clarity
    const [selectedPost, setSelectedPost] = useState(null); // To hold the single found post


    useEffect(() => {
        // Ensure 'allPosts' (the array from state) and 'slug' (from URL) are available
        if (!allPosts || !slug) {
            setSelectedPost(null); // No posts to search in, or no slug to search for
            return;
        }

        // Find the post object whose 'slug' property matches the 'slug' from the URL.
        // IMPORTANT: This assumes each post object in 'allPosts' has a property named 'slug'.
        // If your unique identifier property is named differently (e.g., 'id', 'uniqueId'),
        // change 'p.slug' accordingly (e.g., 'p.id === slug').
        const foundPost = allPosts.find(p => p.slug === slug);

        setSelectedPost(foundPost || null); // Set to the found post, or null if not found

    }, [slug]); // Dependencies: slug from URL, and the array of all posts



    const formatDateToYYMMDD=(dateString) =>{
        // Create a Date object from the input string
        const date = new Date(dateString);

        // Get year, month, and day
        const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1. Pad with '0' if needed.
        const day = date.getDate().toString().padStart(2, '0'); // Pad with '0' if needed.

        // Combine into YY/MM/DD format
        return `${year}/${month}/${day}`;
    }

    const createMarkup = (htmlString) => {
        return { __html: htmlString || '' }; // Ensure htmlString is not null/undefined
    };

return (
    <div className='mtu_posts_page'>
        <Sidebar_MTU posts={allPosts} />
        <div className='mtu_content_display'>
            {selectedPost ? (
                // Only render this content if selectedPost is not null (i.e., it exists)
                <>
                    <h1>{selectedPost.title}</h1>
                    {/* Also check if selectedPost.update exists before formatting */}
                    {selectedPost.update ? (
                        <p>Updated on: {formatDateToYYMMDD(selectedPost.update)}</p>
                    ) : (
                        <p>Update date not available.</p>
                    )}
                    {selectedPost.content ? (
                        <div dangerouslySetInnerHTML={createMarkup(selectedPost.content)} />
                    ) : (
                        <p>No Content Avaiable</p>
                    )}
                    
                </>
            ) : (
                // Optional: Show a loading message or a "not found" message
                slug && allPosts ? <p>Post not found.</p> : <p>Loading post details...</p>
            )}
        </div>
    </div>
);
}

export default MTU_Post_page
