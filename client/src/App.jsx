// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Ensure correct path


// Page and Component Imports
import Header from './components/header/header.jsx'; // Assuming header is .jsx or .js
import Login from './pages/login/login.jsx';     // Assuming login is .jsx or .js
import Dashboard from './pages/dashbaord/dash.jsx';
import Page404 from './pages/404 page/404NotFound.jsx';
import HomePage from './pages/home/home.jsx';
import Register from './pages/register/reg.jsx';
import RegSuccess from './pages/register/req_suc.jsx';


// Import other pages like HomePage, DashboardPage etc. when you create them

function App() {
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

        {/* ---------------------------- All Others ---------------------------- */}

        <Route path='/*' element={<Page404/>}/>

      </Routes>
    </>
  );
}

export default App;