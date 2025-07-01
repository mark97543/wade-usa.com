import React from 'react';
import LoginButtons from '../LoginButtons/LoginButtons';

/**
 * Imports the Login Buttons and user welcome.
 * @param {user} the user info
 * @returns {React} react item
 */
export const Login_Menus = (user) => {
  return (
    <div>
        {user ? (<h3>Hello, {user.first_name || user.email}</h3>) : ("")}
        <LoginButtons />
    </div>
  )
};

/**
 * Imports the Login Buttons and user welcome.
 * @returns {React} react item
 */
export const Travel_Items = (user) => {
  return (
    <div>
      <p>Travel</p>
    </div>
  )
};
