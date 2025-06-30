import React from 'react';
import './Header.css'; // Import the component's specific styles
import LoginButtons from '../LoginButtons/LoginButtons';
import { useAuth } from '@wade-usa/auth';



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
        {user ? (<h3>Hello, {user.first_name || user.email}</h3>) : ("")}
        
        <LoginButtons />
      </div>
 
    </header>
  );
};

export default Header;
