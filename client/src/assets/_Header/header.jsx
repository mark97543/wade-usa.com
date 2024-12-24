import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import React from 'react';
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

            </div>
        </nav>
    </div>
  )
};

export default Header;