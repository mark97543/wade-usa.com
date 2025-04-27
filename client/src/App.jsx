// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Ensure correct path

// Page and Component Imports
import Header from './components/header/header.jsx'; // Assuming header is .jsx or .js
import Login from './pages/login/login.jsx';     // Assuming login is .jsx or .js
// Import other pages like HomePage, DashboardPage etc. when you create them

function App() {
  return (
    <> {/* Use Fragment or a main div if needed */}
      <Header />
      <Routes>
        {/* -------------------------- {Unprotected Routes} -------------------------- */}
        <Route path="/" element={<Login />} /> {/* Or redirect to /login or show a HomePage */}


        {/* ---------------------------- Protected Routes ---------------------------- */}

      </Routes>
    </>
  );
}

export default App;