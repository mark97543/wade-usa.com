import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home/Home.jsx'
import Page404 from './404 page/404NotFound.jsx'
import Login from './Login/Login.jsx'
import Register from './Registration/Registration.jsx'
import Docker from './Dock/Docker.jsx'
import Goodbye from './Goodbye/Goodbye.jsx'
import { ProtectedRoute } from '@wade-usa/auth'; // Import our protector


function HomePage() {
  return (
 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path ='/goodbye' element={<Goodbye/>} />
      
      {/* Protected Routes */}
      <Route path='/docker' element={<ProtectedRoute><Docker /></ProtectedRoute>}/>

      <Route path='*' element={<Page404/>}/>
    </Routes>


  )
}

export default HomePage