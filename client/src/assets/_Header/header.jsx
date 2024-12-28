import React from 'react';
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './header.css';

const Header = () => {
  return(
    <div>
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark" id='navbarheader'>
            <div className="container-fluid">
              <a className="navbar-brand" id='logoforheader' href="/">M+S</a>
              {/* --------- This is for when the bar shrinks a ham button will show -------- */}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              {/* --------- Mormal Sized Displays-------- */}
              <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link active" aira-current='page' href="/todo">To Do's</a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link active' aria-current='page' href='/travelplanner'>Travel Planner</a>
                  </li>
                </ul>
              </div>
            </div>
        </nav>
    </div>
  )
};

export default Header;