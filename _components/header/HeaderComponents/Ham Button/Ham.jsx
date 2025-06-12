import React, {useState} from 'react'
import './Ham.css' // Assuming you have a CSS file for styling the Ham component
import LoginButtons from '../LoginButtons/LoginButtons';
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use authentication state
import { useNavigate } from 'react-router-dom'; // Import useNavigate



function Ham() {

  const [isOpen, setIsOpen] = useState(false); // State to manage the open/close state of the hamburger menu

  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout, user } = useAuth(); // Get authentication state from AuthContext

  const hamFunction = (x) => {
      //x.classList.toggle("change");
      //console.log(x)
      setIsOpen(!isOpen); // Toggle the open state when the hamburger icon is clicked
  }

  //Toggle on item click
  const handleNavLinkClick = (path) => {
    navigate(path); // Navigate to the specified path
    setIsOpen(false); // Close the menu
    // The hamFunction will handle removing the "change" class from the bars
  }
  

  return (
    <div className='ham_menu'>

      {/* The following divs are the bars of the hamburger icon */}
      <div className={`ham_container ${isOpen ? 'change' : ''}`} onClick={(e) => hamFunction(e.currentTarget)}>
          <div className='bar1'></div>
          <div className='bar2'></div>
          <div className='bar3'></div>
      </div>

      <nav className={`ham_menu_items ${isOpen ? 'open' : ''}`}>
        {/* Navigation items for the hamburger menu */}
        <ul>
          {isAuthenticated ? (
            <>
              {/*Place Secret Sites Here */}
            </>
          ):(
            <>
            </>
          )}
          
        </ul>
        <div className='ham-login-buttons' onClick={()=>setIsOpen(false)}><LoginButtons /></div>
      </nav>
    </div>
  )
}



export default Ham
