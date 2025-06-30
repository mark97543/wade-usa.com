import React from 'react';
import './Header.css'; // Import the component's specific styles
import LoginButtons from '../LoginButtons/LoginButtons';
import { useAuth } from '@wade-usa/auth';
import Hamburger_Button from '../HamburgerButtons/Hamburger_Button';
import { Login_Menus } from './Menu_Functions';

const Header = () => {

  const { user} = useAuth();

  return (
    <header className='header_container'>
      <div className='header_logo'>
        <a href='/'>M+S</a>
      </div>
   
      <div className='Header_Menus'>

      </div>

      <div className='Header_Login_Buttons'>
        <Hamburger_Button lastItem={Login_Menus(user)}/>

        <div className='header_menu_items'>
          {Login_Menus(user)}
        </div>
      </div>
 
    </header>
  );
};

export default Header;
