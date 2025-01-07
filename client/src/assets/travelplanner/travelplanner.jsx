import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import Row0_TP from './row0_tp/row0_tp.jsx';
import Row1_TP from './travelplanner_Row1/row1_travelplanner.jsx';
import Row2_tp from './row2_tp/row2_tp.jsx';
import Row_3 from './row3_tp/row3_tp.jsx';
import Row99_tp from './row99_tp/row99_tp.jsx';

import { getAllTP, TravelInfo } from './travelplanner_dbfunc.js';

export const TPContext = createContext(null);


const TravelPlanner = () => {
    
    const [tpData, setTPData] = useState(); //This is all the trip values in entirety
    const [selectedTrip, setSelectedTrip]=useState('')//Curently selected trip (this is the ID only)
    const [depFlight, setDepFlight]=useState([])
    const [depFlightChkd, setDepFlightChkd]=useState(true)//Row 99 Selection Departing Flights
    const [hotelsChkd, setHotelsChkd]=useState(true)//Row 99 Selection Hotels
    const [hotels, setHotels]=useState("")//Hotel Data
 

    useEffect(()=>{
        const fetchData = async () => {
            await getAllTP(setTPData); // Wait for getAllTP to complete
            if (selectedTrip) {
                const flightData = await TravelInfo(selectedTrip, "departingflights"); // Wait for TravelInfo to complete
                const hotelData = await TravelInfo(selectedTrip,"hotels");//Pulls in Hotel Data
                setDepFlight(flightData);
                setHotels(hotelData)
            }
          };
          fetchData(); // Execute the async function
    }, [selectedTrip, depFlight, hotels]) //need to put in here when we save our data. 
   
    //console.log(hotels)
    //console.log(selectedTrip)

    return (
        <div >
            <TPContext.Provider value ={{tpData, setSelectedTrip, selectedTrip, setTPData, depFlight, depFlightChkd, setDepFlightChkd, setDepFlight, hotelsChkd, setHotelsChkd, hotels}}>
                <Row0_TP />
                <Row1_TP />
                <Row2_tp />
                <Row_3 />
                <Row99_tp />
            </TPContext.Provider>
        </div>
    )
    }

export default TravelPlanner; 