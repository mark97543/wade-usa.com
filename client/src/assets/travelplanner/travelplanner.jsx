import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import Row0_TP from './row0_tp/row0_tp.jsx';
import { getAllTP } from './travelplanner_dbfunc.js';

export const TPContext = createContext(null);


const TravelPlanner = () => {
    
    const [tpData, setTPData] = useState(); //This is all the trip values in entirety
    const [selectedTrip, setSelectedTrip]=useState('')//Curently selected trip (this is the ID only)

    useEffect(()=>{
        getAllTP(setTPData)
        
    }, [selectedTrip]) //need to put in here when we save our data. 
   
    //console.log(selectedTrip)

    return (
        <div>
            <TPContext.Provider value ={{tpData, setSelectedTrip, selectedTrip}}>
                <Row0_TP />
            </TPContext.Provider>
        </div>
    )
    }

export default TravelPlanner; 