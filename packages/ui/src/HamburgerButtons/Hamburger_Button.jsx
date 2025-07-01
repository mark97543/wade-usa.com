import React, { useState } from 'react';
import './Hamburger_Button.css';
import { useAuth } from '@wade-usa/auth';
import { useNavigate } from 'react-router-dom';

function Hamburger_Button({ lastItem, listItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const hamFunction = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='ham_menu'>
      <div className={`ham_container ${isOpen ? 'change' : ''}`} onClick={hamFunction}>
        <div className='bar1'></div>
        <div className='bar2'></div>
        <div className='bar3'></div>
      </div>

      <nav className={`ham_dropdown ${isOpen ? 'change' : ''}`} onClick={hamFunction}>
        <div className='ham_dropdown_listItems' onClick={(e) => e.stopPropagation()}>
          
          {/* This maps over your listItems and adds the 'onItemClick' prop 
            to each child component (like your Dropdown)
          */}
          {React.Children.map(listItems, (child) => 
            React.cloneElement(child, { onItemClick: hamFunction })
          )}

        </div>
        <div className="menu_divider"></div>
        <div className='ham_dropdown_lastItem'>
          {lastItem} 
        </div>
      </nav>
    </div>
  );
}

export default Hamburger_Button;