import React, {createContext, useState, useContext}from 'react'
import ReactDOM from 'react-dom/client'
import App from './assets/_Home/App.jsx';
import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './assets/_Header/header.jsx';
import Footer from './assets/_Footer/footer.jsx';
import ToDo from './assets/ToDo/todo.jsx';
import TravelPlanner from './assets/travelplanner/travelplanner.jsx';
import Mp from './assets/mp/mp.jsx';
import { useLocation } from 'react-router-dom'; // Import useLocation

export const MainContext = createContext(null);

const AppWrapper = () => {
  const [footerVis, setFooterVis] = useState(true);
  // const location = useLocation();

  // Update footerVis based on URL path
  React.useEffect(() => {
      const pathsToHideFooter = ['/mp']; // Add paths here
      setFooterVis(!pathsToHideFooter.includes(location.pathname));
  }, [location]);

  return (
      <MainContext.Provider value={{ footerVis }}>
          <Header />
          <Router>
              <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/todo" element={<ToDo />} />
                  <Route path="/travelplanner" element={<TravelPlanner />} />
                  <Route path="/mp" element={<Mp />} />
              </Routes>
          </Router>
          <Footer />
      </MainContext.Provider>
  );
};




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AppWrapper />
  </React.StrictMode>
);