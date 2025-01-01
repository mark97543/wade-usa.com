import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row0_tp.css'
import { TPContext } from '../travelplanner';
import { deleteTrip, addTrip } from '../travelplanner_dbfunc';

const Row0_TP = () => {
    
    const {tpData, setSelectedTrip, selectedTrip}=useContext(TPContext)
    const [deleteVis, setDeleteVis]=useState(false) //Visibility of the delete buttons
    const [addVis, setAddVis]=useState(true)//Visibility of AddButtons
    const [delDis, setDelDis]=useState(false)//Disables Delete Button
    const [selectTrip, setSelectTrip]=useState(false)//Makes the option for "Select a Trip" to disapear
    const [addEntry, setAddEntry]=useState("")
    

    const deleteToggle = ()=>{
        setDeleteVis(!deleteVis)
    }

    const confirmDelete = ()=>{
        if(selectedTrip==="" || selectedTrip==="new"){
            alert("Come On! You cannot delete this")
            deleteToggle()
            setSelectedTrip("")
        }else{ //Initiates the Deleted Item
            deleteTrip(selectedTrip)
            deleteToggle()
            setSelectTrip(false)
            setSelectedTrip("")
        }
    }
  
    const addNewTrip = (e)=>{//triggers the add new trip items
        if(e==="new"){
            setAddVis(false)
            setDelDis(true)
        }else{
            setAddVis(true)
            setDelDis(false)
            setAddEntry("")
        }
        setSelectTrip(true)
    }

    const saveTrip = async () =>{
        //duplicate error handeling
        const copy = tpData.some(trip => trip.tripname.toLowerCase() === addEntry.toLowerCase());
        if (copy === true) {
            alert("No Bueno: Trip Name Already Exists");
            return;
        }
        const newID = await addTrip(addEntry) 
        setAddVis(true)
        setDelDis(false)
        console.log(newID)
        setSelectedTrip(newID)
        console.log(selectedTrip)
    }
    
    return (
        <div id='row0container'>
            <select 
                id='row0select' 
                value={selectedTrip} 
                onChange={(e)=>{
                    setSelectedTrip(e.target.value);
                    addNewTrip(e.target.value)
                    }}>
                <option value={""} hidden={selectTrip}>Select a trip</option>
                {tpData &&  tpData.map((trip) => (
                    <option key={trip.id} value={trip.id} >{trip.tripname}</option>
                ))}
                <option value={"new"}>Add New Trip</option>
            </select>
            
            <button id="row0_delete" hidden={deleteVis} disabled={delDis} onClick={()=>deleteToggle()}>Delete</button>
            <div id="delete_div" hidden={!deleteVis}>
                <button id='row0_delete_2' onClick={(e)=>confirmDelete()} >Sure?</button>
                <button id='row0_cancel'onClick={()=>deleteToggle()}>Cancel</button>
            </div>

            <div id='addtrip' hidden={addVis}>
                <input id="addinput" type='text' placeholder='Enter New Trip Name' value={addEntry} onChange={(e)=>setAddEntry(e.target.value)}></input>
                <button id='addsavetrip' onClick={()=>saveTrip()}>Save</button>
            </div>
        </div>
    )
}

export default Row0_TP; 







