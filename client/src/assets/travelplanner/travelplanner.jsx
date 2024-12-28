import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import Row0_TP from './row0_tp/row0_tp';
import { fetchUniquTrips } from './travelplanner_dbfunc';
export const TPContext = createContext(null);


const TravelPlanner = () => {

    const [tripNames, setTripNames]=useState([])
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
      const loadData = async () => {
        setLoading(true); // Set loading to true before fetching
        await fetchUniquTrips(setTripNames);
        setLoading(false); // Set loading to false after fetching
      };
  
      loadData();
    }, []); // Run only once on mount



    const refresh = ()=>{
        fetchUniquTrips(setTripNames)
    }

    return (
        <div>
            <TPContext.Provider value ={{tripNames, refresh}}>
                <Row0_TP />
            </TPContext.Provider>
        </div>
    )
    }

export default TravelPlanner; 