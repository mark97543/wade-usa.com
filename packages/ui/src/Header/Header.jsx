import React from 'react';
import './Header.css'; // Import the component's specific styles
import LoginButtons from '../LoginButtons/LoginButtons';

const Header = () => {


  return (
    <header className='header_container'>
      <div className='header_logo'>
        <a href='/'>M+S</a>
      </div>
   
      <div className='Header_Menus'>

      </div>

      <div className='Header_Login_Buttons'>
        <LoginButtons />
      </div>
 
    </header>
  );
};

export default Header;
