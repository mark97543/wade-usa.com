import React, { useState, useEffect, useRef } from 'react';
import './Dropdown.css'; // Importing its specific CSS file

function Dropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to detect clicks outside the dropdown

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(prevIsOpen => !prevIsOpen); // Use functional update for setIsOpen
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      // If the dropdown is open AND the click is outside the dropdown container
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dropdownRef]); // Added isOpen to dependencies to ensure effect re-runs when isOpen changes

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        type="button" 
        className={`dropdown-toggle ${isOpen ? 'open' : ''}`} // Add 'open' class when open
        onClick={toggleDropdown}
        aria-haspopup="true" // Accessibility attributes
        aria-expanded={isOpen}
      >
        {title} {/* E.g., "Services", "My Account", "Travel" */}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span> {/* Optional arrow indicator */}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {children} {/* This is where your dropdown links/items will go */}
        </div>
      )}
    </div>
  );
}

export default Dropdown;