import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../0_Contexts/AuthContext.jsx'
import './App.css'
import Header from '@components/header/header.jsx'
import TravelD_Home from './assets/TravelD_Home/TravelD_Home.jsx'

function App() {


  const RedirectToMain404 = () => {
    React.useEffect(() => {
        window.location.href = 'https://wade-usa.com/404'; // Full redirect to main app's 404
    }, []);
    return null; // Or a simple loading/redirect message
  };

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<TravelD_Home />} />

          
          <Route path="*" element={<RedirectToMain404 />} />
        </Routes>
      </AuthProvider>
    </Router>
      
  
  )
}

export default App
