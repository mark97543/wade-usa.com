// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Ensure correct path
import React, {useEffect} from 'react';


// Page and Component Imports
import Header from './components/header/header.jsx'; // Assuming header is .jsx or .js
import Login from './pages/login/login.jsx';     // Assuming login is .jsx or .js
import Dashboard from './pages/dashbaord/dash.jsx';
import Page404 from './pages/404 page/404NotFound.jsx';
import HomePage from './pages/home/home.jsx';
import Register from './pages/register/reg.jsx';
import RegSuccess from './pages/register/req_suc.jsx';
import UnitConverter from './widgets/unitConverter/unitConverter.jsx';
import CurrencyConverter from './widgets/curency_Converter/curency_converter.jsx'; 


// Import other pages like HomePage, DashboardPage etc. when you create them

function App() {

  // // Testing for url issue
  // useEffect(() => {
  //   alert(`VITE_API_BASE_URL is: "${import.meta.env.VITE_API_BASE_URL}"`);
  //   console.log("VITE_API_BASE_URL from deployed code:", import.meta.env.VITE_API_BASE_URL);
  // }, []);



  return (
    <> {/* Use Fragment or a main div if needed */}
      <Header />
      <Routes>
        {/* -------------------------- {Unprotected Routes} -------------------------- */}
        <Route path='/' element={<HomePage/>}/>
        <Route path="/login" element={<Login />} /> {/* Or redirect to /login or show a HomePage */}
        <Route path='/register' element={<Register/>}/>
        <Route path='/register/success' element={<RegSuccess />} />

        
        {/* ---------------------------- Protected Routes ---------------------------- */}

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/unitconverter" element={<ProtectedRoute><UnitConverter /></ProtectedRoute>}/>
        <Route path="/currencyconverter" element={<ProtectedRoute><CurrencyConverter /></ProtectedRoute>}/>

        {/* ---------------------------- All Others ---------------------------- */}

        <Route path='/*' element={<Page404/>}/>

      </Routes>
    </>
  );
}

export default App;