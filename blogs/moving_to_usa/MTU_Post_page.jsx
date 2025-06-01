//blogs/moving_to_usa/page_components/MTU_Post_page.jsx
import React, { useEffect, useState } from 'react';
import Sidebar_MTU from './page_components/sidebar'; // Assuming this is used and correct
import { useParams } from 'react-router-dom';      // useLocation was not used
import '../moving_to_usa/tipocs.css';             // Assuming path is correct
import db_pull from './page_components/db_pull';

function MTU_Post_page() {
    const { slug } = useParams(); // Slug from URL
    const [selectedPost, setSelectedPost] = useState(null); // To hold the single found post
    const [allPosts, setAllPosts] = useState([]); // Holds all posts fetched from DB
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLLECTION_NAME = 'moving_usa_blog';

    // Effect to fetch all posts
    useEffect(() => {
        // console.log("Fetching all posts...");
        db_pull(setLoading, COLLECTION_NAME, setAllPosts, setError);
    }, [COLLECTION_NAME]); // Runs once on mount as COLLECTION_NAME is constant

    // Effect to find and set the selected post
    // This effect runs when 'slug' changes OR when 'allPosts' data is updated,
    // or when loading/error states change (to ensure we don't process stale states).
    useEffect(() => {
        // console.log("Attempting to find post. Slug:", slug, "Loading:", loading, "Error:", error, "AllPosts length:", allPosts.length);
        
        if (loading || error) {
            // If still loading or an error occurred during fetch, don't try to find a post.
            // Reset selectedPost if it was previously set.
            setSelectedPost(null);
            return;
        }

        if (allPosts && allPosts.length > 0 && slug) {
            const foundPost = allPosts.find(p => p.slug === slug);
            // console.log("Found post:", foundPost);
            setSelectedPost(foundPost || null); // Set to found post or null if not found
        } else {
            // console.log("No posts to search or no slug provided.");
            setSelectedPost(null); // If no posts are available or no slug, ensure selectedPost is null
        }
    }, [slug, allPosts, loading, error]); // CRITICAL: Added allPosts, loading, and error to dependencies

    const formatDateToYYMMDD = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn("Invalid date string for formatting:", dateString);
            return 'Invalid Date';
        }
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const createMarkup = (htmlString) => {
        return { __html: htmlString || '' };
    };

    // Render logic based on state
    let contentToDisplay;
    if (loading) {
        contentToDisplay = <p>Loading post details...</p>;
    } else if (error) {
        contentToDisplay = <p style={{ color: 'red' }}>Error loading post: {error}</p>;
    } else if (selectedPost) {
        contentToDisplay = (
            <>
                <h1>{selectedPost.title}</h1>
                {selectedPost.update ? (
                    <p>Updated on: {formatDateToYYMMDD(selectedPost.update)}</p>
                ) : (
                    <p>Update date not available.</p>
                )}
                {selectedPost.content ? (
                    <div dangerouslySetInnerHTML={createMarkup(selectedPost.content)} />
                ) : (
                    <p>No Content Available</p>
                )}
            </>
        );
    } else {
        // This means loading is false, no error, but no post was found for the slug
        contentToDisplay = <p>Post not found.</p>;
    }

    return (
        <div className='mtu_posts_page'>
            <Sidebar_MTU /> {/* Assuming Sidebar_MTU is correctly implemented */}
            <div className='mtu_content_display'>
                {contentToDisplay}
            </div>
        </div>
    );
}

export default MTU_Post_page;