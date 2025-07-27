import React from 'react';
import './Header.css'; // Import the component's specific styles
import LoginButtons from '../LoginButtons/LoginButtons';
import { useAuth } from '@wade-usa/auth';
import Hamburger_Button from '../HamburgerButtons/Hamburger_Button';
import { Login_Menus, Travel_Items } from './Menu_Functions';
import Dropdown from '../Dropdown/Dropdown';

/* -------------------------------------------------------------------------- */
/*                            Dropdown Menu Arrays                            */
/* -------------------------------------------------------------------------- */
const travelMenuItems = [
  { id: 1, label: 'Upcomming Trips', link: '/travel' },
  { id: 2, label: 'Past Trips', link: '/travel/past-trips' },
];

/* -------------------------------------------------------------------------- */
/*                     Menus to move on resolution changes                    */
/* -------------------------------------------------------------------------- */
const menuItems = [
  <Dropdown key="travel-menu" title={'Travel'} items={travelMenuItems}/>
]



const Header = () => {

  const { user} = useAuth();

  return (
    <header className='header_container'>
      <div className='header_logo'>
        <a href='/'>M+S</a>
      </div>
   
      <div className='Header_Menus'>
        {menuItems}
      </div>

      <div className='Header_Login_Buttons'>
        <Hamburger_Button lastItem={Login_Menus(user)} listItems={menuItems}/>

        <div className='header_menu_items'>
          {Login_Menus(user)}
        </div>
      </div>
 
    </header>
  );
};

export default Header;
