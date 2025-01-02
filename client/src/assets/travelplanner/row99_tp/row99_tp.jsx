import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row99_tp.css'
import { TPContext } from '../travelplanner';

const Row99_tp = () => {
    const {selectedTrip}=useContext(TPContext)
    const [r99Vis, setR99Vis]=useState(true)

    useEffect(()=>{ //Makes this row invisible when the "Select a trip" or "Add new Trip" is selected.
        if(selectedTrip==="" || selectedTrip==="new"){
            setR99Vis(true)
        }else{
            setR99Vis(false)
        }
        //console.log(selectedTrip)
    }, [selectedTrip]) //need to put in here when we save our data. 


    return (
        <div id='row99_div' hidden={r99Vis}>
            <select id='select_r99'>
                <option>Select Item To Add</option>
                <option>Activities</option>
                <option>Car Rental</option>
                <option>Departing Flights</option>
                <option>Hotels</option>
                <option>Returning Flight</option>
            </select>
            <button id='r99_edit_button'>Add Item</button>
        </div>
    )
}

export default Row99_tp; 