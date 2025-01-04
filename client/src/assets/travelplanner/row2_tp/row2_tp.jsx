import React, { useState, useEffect, createContext, useContext, useRef }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row2_tp.css'
import { TPContext } from '../travelplanner';
import { format } from 'date-fns';
import { AddFlight } from '../travelplanner_dbfunc';


const Row2_tp = () => {
    const {depFlight, depFlightChkd, selectedTrip, setSelectedTrip}=useContext(TPContext)
    const [hide, setHide]=useState(true)//Hide whole area
    const [addItem, setAddItem]=useState(false)//add items hidden
    const [newDate, setNewDate]=useState("")//New Date Entry
    const [newOrigin, setNewOrigin]=useState("")
    const [newAirline, setNewAirline]=useState("")
    const [newFlight, setNewFlight]=useState("")
    const [newDepart, setNewDepart]=useState("")
    const [newDest, setNewDest]=useState("")
    const [newLand, setNewLand]=useState("")
    const [newNote, setNewNote]=useState("")

 

    useEffect(()=>{
        try{
            if(depFlight.length > 0 && depFlightChkd===true){
                setHide(false)
            }else if(depFlightChkd === false){
                setHide(true)
            }else if(depFlightChkd===true){
                setHide(false)
            }
        }catch(error){
            setHide(true)
        }

    },[depFlight, depFlightChkd])

    const handleTimeChange = (e, setter) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        if (value.length > 2) {
            value = value.slice(0, 2) + ':' + value.slice(2, 4);
        }
        setter(value);
    };

    const NewItem = ()=>{
        if(newDate===""){
            alert("A Date must be entered")
            return
        }
        const newData = {
            trip_id:selectedTrip,
            date:newDate,
            origin:newOrigin,
            airline:newAirline,
            flight:newFlight,
            depart:newDepart,
            dest:newDest,
            land:newLand,
            note:newNote
        }

        AddFlight(newData, "departingflights")
        //Need to Push to DB here. 


        setAddItem(!addItem)
        setNewDate("")
        setNewOrigin("")
        setNewAirline("")
        setNewFlight("")
        setNewDepart("")
        setNewDepart("")
        setNewDest("")
        setNewLand("")
        setNewNote("")
    }

    return (
        <div id='r2_out2_div' hidden={hide}>
            <div id='r2_out_div' >
                <div id='dep_flight_div'>
                    <label id='dep_flight_label'>Departing Flights</label>
                </div>
                <div id='row2_table_div'>
                    <div className='r2_date_div'>
                        <label className='r2_basic_label' >Date</label>
                    </div>
                    <div className='r2_origin_div'>
                        <label className='r2_basic_label'>Origin</label>
                    </div>
                    <div className='r2_airline_div'>
                        <label className='r2_basic_label'>Airline</label>
                    </div>
                    <div className='r2_flight_div'>
                        <label className='r2_basic_label'>Flight</label>
                    </div>
                    <div className='r2_depart_div'>
                        <label className='r2_basic_label'>Depart</label>
                    </div>
                    <div className='r2_dest_div'>
                        <label className='r2_basic_label'>Dest</label>
                    </div>
                    <div className='r2_land_div'>
                        <label className='r2_basic_label'>Land</label>
                    </div>
                    <div className='r2_note_div'>
                        <label className='r2_basic_label'>Note</label>
                    </div>

                </div>

                {Array.isArray(depFlight) && depFlight.map((flight,index)=>(
                    <div 
                        id='r2_data_div' 
                        key={index}
                        style={{ backgroundColor: index % 2 === 0 ? 'rgb(77,77,77)' : 'inherit' }}
                    >

                        <div className='r2_date_div' >
                            <label id='r2_date_input' type='text'>{format(flight.date, "MM/dd/yy")}</label>
                        </div>

                        <div className='r2_origin_div'>
                            <label id='r2_origin_label'>{flight.origin}</label>
                        </div>

                        <div className='r2_airline_div'>
                            <label id='r2_airline_label'>{flight.airline}</label>
                        </div>

                        <div className='r2_flight_div'>
                            <label id='r2_flight_label'>{flight.flight}</label>
                        </div>

                        <div className='r2_depart_div'>
                            <label id='r2_depart_label'>{flight.depart.substring(0,5)}</label>
                        </div>

                        <div className='r2_dest_div'>
                            <label id='r2_dest_label'>{flight.dest}</label>
                        </div>

                        <div className='r2_land_div'>
                            <label id='r2_land_label'>{flight.land.substring(0,5)}</label>
                        </div>
                        <div className='r2_note_div'>
                            <label id='r2_note_label'>{flight.note}</label>
                        </div>

                    </div>
                ))}
                <div id='r2_bottom' >
                    
                    <div className='r2_date_div' hidden={!addItem}>
                        <input value={newDate} onChange={(e)=>setNewDate(e.target.value)} className='r2_add_input' type='date' placeholder='New'></input>
                    </div>
                    <div className='r2_origin_div' hidden={!addItem}>
                        <input maxLength='3' value={newOrigin} onChange={(e)=>setNewOrigin(e.target.value.toUpperCase())} className='r2_add_input' type='text' placeholder='New'></input>
                    </div>
                    <div className='r2_airline_div'hidden={!addItem} >
                        <input maxLength='7' value={newAirline} onChange={(e)=>setNewAirline(e.target.value.toUpperCase())} className='r2_add_input' type='text' placeholder='New'></input>
                    </div>
                    <div className='r2_flight_div' hidden={!addItem}>
                        <input maxLength='7' value={newFlight} onChange={(e)=>setNewFlight(e.target.value.toUpperCase())} className='r2_add_input' type='text' placeholder='New'></input>
                    </div>
                    <div className='r2_depart_div' hidden={!addItem}>
                        <input maxLength='5'  value={newDepart} onChange={(e)=>handleTimeChange(e, setNewDepart)} className='r2_add_input' type='text' placeholder='HH:MM'></input>
                    </div>
                    <div className='r2_dest_div'hidden={!addItem}>
                        <input maxLength='3' value={newDest} onChange={(e)=>setNewDest(e.target.value.toUpperCase())} className='r2_add_input' type='text' placeholder='New'></input>
                    </div>
                    <div className='r2_land_div' hidden={!addItem}>
                        <input maxLength='5'  value={newLand} onChange={(e)=>handleTimeChange(e, setNewLand)} className='r2_add_input' type='text' placeholder='HH:MM'></input>
                    </div>
                    <div className='r2_note_div'hidden={!addItem}>
                        <textarea maxLength='80' rows='3' value={newNote} onChange={(e)=>setNewNote(e.target.value)} id='r2_textarea' className='r2_add_input' type='text' placeholder='New'></textarea>
                    </div>

                </div>
            </div>
            <div id='r2_button_div'>
                <button id='r2_add_button' hidden={addItem} onClick={()=>setAddItem(!addItem)}>Add Item</button>
                <button id='r2_save_button' hidden={!addItem} onClick={()=>NewItem()}>Save</button>
                <button id='r2_cancel_button' hidden={!addItem} onClick={()=>setAddItem(!addItem)}>Cancel</button>
            </div>
        </div>
    )
}

export default Row2_tp; 