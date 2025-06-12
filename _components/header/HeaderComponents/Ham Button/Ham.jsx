import React, {useState} from 'react'
import './Ham.css' // Assuming you have a CSS file for styling the Ham component
import LoginButtons from '../LoginButtons/LoginButtons';


function Ham() {

  const [isOpen, setIsOpen] = useState(false); // State to manage the open/close state of the hamburger menu

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
          <li><a href="/" onClick={() => handleNavLinkClick('/')}>Home</a></li>
          <li><a href="/about" onClick={() => handleNavLinkClick('/about')}>About</a></li>
          <li><a href="/services" onClick={() => handleNavLinkClick('/services')}>Services</a></li>
          <li><a href="/contact" onClick={() => handleNavLinkClick('/contact')}>Contact</a></li>
          <li><a href="/login" onClick={() => handleNavLinkClick('/login')}>Login</a></li>
          <li><a href="/register" onClick={() => handleNavLinkClick('/register')}>Register</a></li>
          <li><a href="/profile" onClick={() => handleNavLinkClick('/profile')}>Profile</a></li>
          <li><a href="/settings" onClick={() => handleNavLinkClick('/settings')}>Settings</a></li>
          
        </ul>
        <div className='ham-login-buttons' onClick={()=>setIsOpen(false)}><LoginButtons /></div>
      </nav>
    </div>
  )
}



export default Ham
