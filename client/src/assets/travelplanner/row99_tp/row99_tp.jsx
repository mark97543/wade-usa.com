import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row99_tp.css'
import { TPContext } from '../travelplanner';

const Row99_tp = () => {
    const {notesCK, setNotesCK, arrFlightChkd, setArrFlightChkd,actchkd, setActChkd, selectedTrip, depFlight, depFlightChkd, setDepFlightChkd, hotelsChkd, setHotelsChkd, rCChkd, setRCChkd}=useContext(TPContext)
    const [r99Vis, setR99Vis]=useState(true)
    //const [depFlightChkd, setDepFlightChkd]=useState(false)

    useEffect(()=>{ 
        if(selectedTrip==="" || selectedTrip==="new"){//Makes this row invisible when the "Select a trip" or "Add new Trip" is selected.
            setR99Vis(true)
            setDepFlightChkd(false)
            setHotelsChkd(false)
            setRCChkd(false)
            setActChkd(false)
            setArrFlightChkd(false)
            setNotesCK(false)
        }else{
            setR99Vis(false)
            setDepFlightChkd(true)
            setHotelsChkd(true)
            setRCChkd(true)
            setActChkd(true)
            setArrFlightChkd(true)
            setNotesCK(true)
        }

        // try{//Checks if Departing Trip Should be Checked
        //     if(depFlight.length > 0 || depFlightChkd===true){
        //         setDepFlightChkd(true)
        //     }else{
        //         setDepFlightChkd(false)
        //     }
        // }catch(error){
        //     setDepFlightChkd(false)
        // }


    }, [selectedTrip]) //need to put in here when we save our data. 
 

    return (
        <div id='row99_div' hidden={r99Vis}>
            <label id='r99_top'>Hide/Show Items</label>
            <div>
                <input type='checkbox' checked={depFlightChkd} onChange={(e)=>{setDepFlightChkd(!depFlightChkd)}} className='dep_flight'></input>
                <label htmlFor="dep_flight" className='chbx_1'>Departing Flights</label>
                <input type='checkbox' checked={hotelsChkd} onChange={(e)=>{setHotelsChkd(!hotelsChkd)}} className='hotels'></input>
                <label htmlFor="hotels" className='chbx_1'>Hotels</label>
                <input type='checkbox' checked={rCChkd} onChange={(e)=>{setRCChkd(!rCChkd)}} className='rc'></input>
                <label htmlFor="rc" className='chbx_1'>Rental Cars</label>
                <input type='checkbox' checked={actchkd} onChange={(e)=>{setActChkd(!actchkd)}} className='act'></input>
                <label htmlFor="act" className='chbx_1'>Activities</label>
                <input type='checkbox' checked={arrFlightChkd} onChange={(e)=>{setArrFlightChkd(!arrFlightChkd)}} className='arr_flight'></input>
                <label htmlFor="arr_flight" className='chbx_1'>Returning Flights</label>
                <input type='checkbox' checked={notesCK} onChange={(e)=>{setNotesCK(!notesCK)}} className='notes'></input>
                <label htmlFor="notes" className='chbx_1'>Notes</label>
            </div>
            <div id='note_div'>
                <label className='note_text'>Note 1: For The sorting make sure all your time formats are the same</label>
                <label className='note_text'>Note 2: To Edit the Item Double Click on it. </label>
                <label className='note_text'>Note 3: Do not put sensative information like Confirmation numbers in this until a login is created </label>
                <label className='note_text'>Note 4: Make sure Single digit in months or days are preceded with a 0 ie. "02/02/25" </label>
            </div>
        </div>
    )
}

export default Row99_tp; 