// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext.jsx'; // Correct import path
import { BrowserRouter } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* BrowserRouter is outermost */}
      <AuthProvider> {/* AuthProvider is inside BrowserRouter */}
        <App /> {/* App is inside AuthProvider */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);