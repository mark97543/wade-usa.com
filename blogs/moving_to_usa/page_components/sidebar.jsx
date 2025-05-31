//blogs/moving_to_usa/page_components/sidebar.jsx

import React, {useState} from 'react'

function Sidebar_MTU() {
    const [collapsed, setCollapsed]=useState(false)

    const toggleSidebar = () =>{
        setCollapsed(!collapsed)
    }
    
  return (
    <aside>
      <h1>Future Sidebar</h1>
    </aside>
  )
}

export default Sidebar_MTU
