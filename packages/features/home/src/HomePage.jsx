import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home/Home.jsx'
import Page404 from './404 page/404NotFound.jsx'
import Login from './Login/Login.jsx'
import Register from './Registration/Registration.jsx'
import Docker from './Dock/Docker.jsx'
import Goodbye from './Goodbye/Goodbye.jsx'
import { ProtectedRoute } from '@wade-usa/auth'; // Import our protector
import Pending_User from './Pending_User/Pending_User.jsx'
import Forbbiden from './forbidden/Forbbiden.jsx'


function HomePage() {
  return (
 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path ='/goodbye' element={<Goodbye/>} />
      <Route path='/pending-approval' element={<Pending_User />} />
      <Route path='/forbidden' element={<Forbbiden />} />

      
      {/* Protected Routes */}
      <Route path='/docker' element={<ProtectedRoute><Docker /></ProtectedRoute>}/>

      <Route path='*' element={<Page404/>}/>
    </Routes>


  )
}

export default HomePage


    // ================================================================
    // EXAMPLE: PROTECTED ROUTE FOR SPECIFIC ROLES
    // ================================================================

    // This is how you would protect a new page so that only users with
    // the roles 'Basic' or 'Administrator' can access it.

    // 1.  Wrap your new page's component (e.g., <AdminTools />) in the <ProtectedRoute> component.
    // 2.  Add the 'allowedRoles' prop to <ProtectedRoute>.
    // 3.  Provide an array of strings with the names of the roles you want to allow.
    //     The names must exactly match the role names in your Directus project.

  // <Route 
  //   path='/admin-tools' 
  //   element={
  //     <ProtectedRoute allowedRoles={['Basic', 'Administrator']}>
  //       <AdminTools />
  //     </ProtectedRoute>
  //   } 
  // />
  