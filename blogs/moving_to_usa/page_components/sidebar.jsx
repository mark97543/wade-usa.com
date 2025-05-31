//blogs/moving_to_usa/page_components/sidebar.jsx

import React, {useState} from 'react'
import Ham_button from '../../../misc_page_components/hamburger_button/ham_button'
import '../Moving_USA_Blog.css'


function Sidebar_MTU() {
    const [collapsed, setCollapsed]=useState(true)

    const toggleSidebar = () =>{
        setCollapsed(!collapsed)
    }

  return (
    <aside className={`mtu_sidebar ${collapsed ? 'collapsed':'' } `}>
        <Ham_button onButtonClick={toggleSidebar} status={collapsed}/>
        {!collapsed && (
            <h1>Open</h1>
        )}
    </aside>
  )
}

export default Sidebar_MTU
