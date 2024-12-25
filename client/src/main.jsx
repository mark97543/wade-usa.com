import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './assets/_Home/App.jsx';
import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './assets/_Header/header.jsx';
import Footer from './assets/_Footer/footer.jsx';
import ToDo from './assets/ToDo/todo.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
      <Router>{/* Wrap with Router */}
        <Routes>{/* Use Routes */}
          <Route path='/' element={<App />} /> {/* Define the route for the home page */}
          <Route path='/todo' element={<ToDo/>} />
        </Routes>
      </Router>
      <Footer/>
  </React.StrictMode>
)