import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import Row0_TP from './row0_tp/row0_tp.jsx';
import Row1_TP from './travelplanner_Row1/row1_travelplanner.jsx';
import Row2_tp from './row2_tp/row2_tp.jsx';
import Row_3 from './row3_tp/row3_tp.jsx';
import Row4 from './row4_tp/row4_tp.jsx';
import Row5 from './row5_tp/row5_tp.jsx';
import Row99_tp from './row99_tp/row99_tp.jsx';

import { getAllTP, TravelInfo } from './travelplanner_dbfunc.js';

export const TPContext = createContext(null);


const TravelPlanner = () => {
    
    const [tpData, setTPData] = useState(""); //This is all the trip values in entirety
    const [selectedTrip, setSelectedTrip]=useState('')//Curently selected trip (this is the ID only)
    const [depFlight, setDepFlight]=useState([])
    const [depFlightChkd, setDepFlightChkd]=useState(true)//Row 99 Selection Departing Flights
    const [hotelsChkd, setHotelsChkd]=useState(true)//Row 99 Selection Hotels
    const [hotels, setHotels]=useState("")//Hotel Data
    const [rCChkd, setRCChkd]=useState(true)
    const [rCars, setRCars]=useState("")//Rental Car Data
    const [actchkd, setActChkd]=useState(true)
    const [activities, setActivities]=useState("")
 

    useEffect(()=>{
        const fetchData = async () => {
            await getAllTP(setTPData); // Wait for getAllTP to complete
            if (selectedTrip) {
                const flightData = await TravelInfo(selectedTrip, "departingflights"); // Wait for TravelInfo to complete
                const hotelData = await TravelInfo(selectedTrip,"hotels");//Pulls in Hotel Data
                const rentalCarData = await TravelInfo(selectedTrip, "rc")//Pulls in Rental Car Data
                const activityItems = await TravelInfo(selectedTrip, "activities")//Pulls in activity data
                setDepFlight(flightData);
                setHotels(hotelData)
                setRCars(rentalCarData)
                setActivities(activityItems)
            }
          };
          fetchData(); // Execute the async function
    }, [selectedTrip, depFlight, hotels, rCars, activities]) //need to put in here when we save our data. 
   
    //console.log(activities)
    //console.log(selectedTrip)

    return (
        <div >
            <TPContext.Provider value ={{activities, actchkd, setActChkd, rCars, rCChkd, setRCChkd, tpData, setSelectedTrip, selectedTrip, setTPData, depFlight, depFlightChkd, setDepFlightChkd, setDepFlight, hotelsChkd, setHotelsChkd, hotels}}>
                <Row0_TP />
                <Row1_TP />
                <Row2_tp />
                <Row_3 />
                <Row4/>
                <Row5/>
                <Row99_tp />
            </TPContext.Provider>
        </div>
    )
    }

export default TravelPlanner; 