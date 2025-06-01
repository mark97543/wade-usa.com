//blogs/moving_to_usa/page_components/sidebar.jsx

import React, {useState, useEffect} from 'react'
import Ham_button from '../../../misc_page_components/hamburger_button/ham_button'
import '../Moving_USA_Blog.css'
import Sidbar_blogs from './Sidbar_blogs'


function Sidebar_MTU({posts}) {
    const [collapsed, setCollapsed]=useState(true)
    const [search, setSearch]=useState(posts)
    const [searchTerm, setSearchTerm]=useState()

    const toggleSidebar = () =>{
        setCollapsed(!collapsed)

    }

    useEffect(() => {
        if (!searchTerm) {
            setSearch(posts); // If search is empty, show all posts
            return;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase(); // Make search term lowercase
        const results = posts.filter(post => {
            // Check if the post object and its properties exist before trying to access them
            const title = post.title || '';         // Get title or empty string if undefined
            const summary = post.summary || '';   // Get summary or empty string if undefined

            // Perform case-insensitive search
            const titleMatch = title.toLowerCase().includes(lowercasedSearchTerm);
            const summaryMatch = summary.toLowerCase().includes(lowercasedSearchTerm);

            // The post is a match if the search term is in EITHER the title OR the summary
            return titleMatch || summaryMatch;
        });
        setSearch(results);
    }, [searchTerm, posts]);



  return (
    <aside className={`mtu_sidebar ${collapsed ? 'collapsed':'' } `}>
        <div className='mtu_sidbar_row1'>
            {!collapsed && (
                <input className="form-control form-control-lg" type="text" placeholder="search" id="inputLarge" onChange={(e)=>setSearchTerm(e.target.value)}/>
            )}
            <Ham_button onButtonClick={toggleSidebar} status={collapsed}/>
        </div>
        {!collapsed && (
            <Sidbar_blogs posts={search}/>
        )}

    </aside>
  )
}

export default Sidebar_MTU
