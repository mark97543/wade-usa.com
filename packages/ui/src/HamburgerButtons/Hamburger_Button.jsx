import React, {useState} from 'react'
import './Hamburger_Button.css' // Assuming you have a CSS file for styling the Ham component
import { useAuth } from '@wade-usa/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate




function Hamburger_Button({lastItem}) {

  const [isOpen, setIsOpen] = useState(false); // State to manage the open/close state of the hamburger menu

  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout, user } = useAuth(); // Get authentication state from AuthContext

  const hamFunction = () => {
    setIsOpen(!isOpen); // Toggle the open state when the hamburger icon is clicked
  }

  return (
    <div className='ham_menu'>

      {/* The following divs are the bars of the hamburger icon */}
      <div className={`ham_container ${isOpen ? 'change' : ''}`} onClick={hamFunction}>
          <div className='bar1'></div>
          <div className='bar2'></div>
          <div className='bar3'></div>
      </div>

      <nav className={`ham_dropdown ${isOpen ? 'change': ''}`} onClick={hamFunction} >
        <div className='ham_dropdown_listItems'>

        </div>
        <div className="menu_divider"></div>
        <div className='ham_dropdown_lastItem'>
           {lastItem} 
        </div>
      </nav>

    </div>
  )
}



export default Hamburger_Button