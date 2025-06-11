import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../0_Contexts/AuthContext.jsx'
import ProtectedRoute from '../../0_Contexts/ProtectedRoute.jsx'
import './App.css'
import Header from '@components/header/header.jsx' // Importing Header component from shared components directory
import Home from './pages/Home/Home.jsx' // Importing Home component from local pages directory
import Page404 from './pages/404 page/404NotFound.jsx' // Importing 404 Not Found component from local pages directory
import Login from './pages/Login/Login.jsx' // Importing Login component from local pages directory
import Docker from './pages/Dock/Docker.jsx'
import Forbbiden from './pages/forbidden/Forbbiden.jsx'
import Register from './pages/Registration/Registration.jsx'
import Pending_User from './pages/Pending_User/Pending_User.jsx'
import Goodbye from './pages/Goodbye/Goodbye.jsx'

const pendingRole = import.meta.env.VITE_PENDING_USER; // Define the role name for pending users
const authorizedRole = import.meta.env.VITE_AUTHORIZED_USER; // Define the role name for authorized users
const administratorRole = import.meta.env.VITE_ADMIN_USER; // Define the role name for administrators

function App() {


  //console.log('Sending environment variables to the console:', administratorRole);

  return (

    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/forbidden' element={<Forbbiden />} />
          <Route path='/register' element={<Register />} />
          <Route path='/pending' element={<Pending_User />} />
          <Route path='/goodbye' element={<Goodbye />} />


          {/* Protected Routes  */}
          <Route element={<ProtectedRoute allowedRoles={[administratorRole, authorizedRole]}/>} >
            <Route path='/docker' element={<Docker />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
