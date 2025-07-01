import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css'; 

function Dropdown({ title, items = [], onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // This function will now be called when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);      // First, close the dropdown itself
    if (onItemClick) {     // Then, if the callback prop exists...
      onItemClick();       // ...call it to close the hamburger menu
    }
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        type="button" 
        className={`dropdown-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {title}
        <span className="arrow">{isOpen ? '▼' : '▲'}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item) => (
            <Link 
              key={item.id}
              to={item.link} 
              className="dropdown-item"
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;