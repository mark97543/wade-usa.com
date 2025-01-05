import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row99_tp.css'
import { TPContext } from '../travelplanner';

const Row99_tp = () => {
    const {selectedTrip, depFlight, depFlightChkd, setDepFlightChkd }=useContext(TPContext)
    const [r99Vis, setR99Vis]=useState(true)
    //const [depFlightChkd, setDepFlightChkd]=useState(false)

    useEffect(()=>{ 
        if(selectedTrip==="" || selectedTrip==="new"){//Makes this row invisible when the "Select a trip" or "Add new Trip" is selected.
            setR99Vis(true)
        }else{
            setR99Vis(false)
        }

        try{//Checks if Departing Trip Should be Checked
            if(depFlight.length > 0 || depFlightChkd===true){
                setDepFlightChkd(true)
            }else{
                setDepFlightChkd(false)
            }
        }catch(error){
            setDepFlightChkd(false)
        }


    }, []) //need to put in here when we save our data. 
 

    return (
        <div id='row99_div' hidden={r99Vis}>
            <label id='r99_top'>Hide/Show Items</label>
            <div>
                <input type='checkbox' checked={depFlightChkd} onChange={(e)=>{setDepFlightChkd(!depFlightChkd)}} id='dep_flight'></input>
                <label htmlFor="dep_flight" id='chbx_1'>Departing Flights</label>
            </div>
            <div id='note_div'>
                <label className='note_text'>Note 1: For The sorting make sure all your time formats are the same</label>
                <label className='note_text'>Note 2: To Edit the Item Double Click on it. </label>
            </div>
        </div>
    )
}

export default Row99_tp; 