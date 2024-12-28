import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row0_tp.css'
import { TPContext} from '../travelplanner';
import { addNewTrip } from '../travelplanner_dbfunc';

const Row0_TP = () => {
 
    const [r0_ButtonToggle, setR0_ButtonToggle]=useState(false)
    const {tripNames, refresh} = useContext(TPContext)
    const [selecttrip, setSeectTrip] = useState(false) // Select a trip state
    const [addstuff, setAddStuff]=useState(true)//brings up add menu

    const deleteselect=()=>{
        setR0_ButtonToggle(true)
    }

    const cancelDeleteButton = ()=>{
        setR0_ButtonToggle(false)
    }

    const deleteYES = ()=>{
        setR0_ButtonToggle(false)
        console.log("Need to Add Delete Items") //TODO
    }
    
    const selectChange= (e)=>{
        setSeectTrip(true)
        const value = e.target.value
        if(value ==="Add Trip"){
            setAddStuff(false)
            setR0_ButtonToggle(false)//resetting this
        }else{
            console.log("Need to Load the respective items") //TODO:This May just be a setstate fro mabove (this will allow me to move the selection abov)
            setAddStuff(true)
            document.getElementById("addtripentry").value="" //Removes entry when deselect
        }
    }

    const addCancel = ()=>{
        setAddStuff(true)
        document.getElementById("addtripentry").value="" //Removes entry when deselect
        setR0_ButtonToggle(false)//resetting this
        setSeectTrip(false)
        document.getElementById('row0select').value = "" 
    }

    const addTrip = async ()=>{
        //TODO: FUTURE NEED TO MAKE AFTER CREATE A TRIP THAT YOU WILL START WITH IT
        const newdest = document.getElementById('addtripentry').value
        
        const newdest2 = newdest.toLowerCase()
        const copy = tripNames.some(trip=>trip.tripname.toLowerCase()===newdest2)//checks for duplicates

        if(copy === true){
            alert("No Bueno: Trip Name Already Exists")
            return
        }
 
        setAddStuff(true)
        addNewTrip(newdest)
        refresh()        
    }

    return (
        <div id='row0TPMainDiv'>
            <select className="form-select" id="row0select" onChange={(e)=>selectChange(e)}>
                <option value="" hidden={selecttrip} >Select A Trip</option>
                {tripNames.map((trip, index)=>(
                    <option key={index} value={trip.tripname}>{trip.tripname}</option>
                ))}
                <option>Add Trip</option>
            </select>
            <div hidden={!addstuff}>
                <button type="button" className="btn btn-info" id='row0_deleteButton' hidden={r0_ButtonToggle} onClick={()=>deleteselect()}>Delete Trip</button>
            </div>
            <div id="row0deleteselector">
                <button type="button" className="btn btn-danger" id='row0_surebutton' hidden={!r0_ButtonToggle} onClick={()=>deleteYES()}>Confirm</button>
                <button type="button" className="btn btn-success" id='row0_cancelbutton' hidden={!r0_ButtonToggle} onClick={()=>cancelDeleteButton()} >Cancel</button>
            </div>
            <div hidden={addstuff} id="additemdiv">
                <input type="text" className="form-control" placeholder="Enter New Trip Name" id='addtripentry'/>
                <div id='addbuttondiv'>
                    <button type="button" className="btn btn-success addbuttons" onClick={()=>addTrip()}>Add</button>
                    <button type="button" className="btn btn-danger addbuttons" onClick={()=>addCancel()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Row0_TP; 


