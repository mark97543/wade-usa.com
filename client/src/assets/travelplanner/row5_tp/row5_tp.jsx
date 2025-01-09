import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import { TPContext } from '../travelplanner';
import './row5_tp.css'
import { AddFlight, DeleteFlight, EditFlight } from '../travelplanner_dbfunc';

const Row5 = () => {
    const {actchkd, activities, selectedTrip}=useContext(TPContext)
    const [addItemVis, setAddItemVis]=useState(false)
    const [editItem, setEditItem]=useState(true)
    const [newDate, setNewDate]=useState("")
    const [newTime, setNewTime]=useState("")
    const [newEvent, setNewEvent]=useState("")
    const [newDetails, setNewDetails]=useState("")
    const [rowID, setRowID]=useState("") //Curently Edited Row
    

    const dateBlur = (value, setter)=>{
        const a = new Date (value)
        const mm = String(a.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const dd = String(a.getDate()).padStart(2, '0');
        const yy = String(a.getFullYear()).slice(-2);
        //console.log(`${mm}/${dd}/${yy}`);
        setter(`${mm}/${dd}/${yy}`)
    }

    const reset_labels = ()=>{
        setNewDate("")
        setNewTime("")
        setNewEvent("")
        setNewDetails("")
    }

    const addAct = ()=>{
        const data = {
            trip_id:selectedTrip ,
            date:newDate,
            time:newTime,
            event:newEvent,
            details:newDetails
        }

        AddFlight(data, 'activities')
        setAddItemVis(!addItemVis)
        reset_labels()
    }

    const editor = (act)=>{
        setRowID(act.id)
        setEditItem(false)
        setNewDate(act.date)
        setNewTime(act.time)
        setNewEvent(act.event)
        setNewDetails(act.details)

    }

    const cancelEditor = ()=>{
        setAddItemVis(false)
        setEditItem(true)
        reset_labels()
    }

    const deleteItem = ()=>{
        DeleteFlight(rowID, 'activities')

        setAddItemVis(false)
        setEditItem(true)
        reset_labels()
    }

    const SaveRow = ()=>{

        const newData = {
            id:rowID,
            trip_id:selectedTrip ,
            date:newDate,
            time:newTime,
            event:newEvent,
            details:newDetails
        
        }

        EditFlight(newData, 'activities')

        setAddItemVis(false)
        setEditItem(true)
        reset_labels()
      
    }
    

    return (
        <div hidden={!actchkd} id='r5_out2_div'>
            <div id='r5_outside_div'>
                <div id='row5_title'>
                    <label id='row5_title_label'>Activities</label>
                </div>
                <div id='row5_title_divs'>
                    <div className='row5_date'>
                        <label className='row5_titles'>Date</label>
                    </div>
                    <div className='row5_date'>
                        <label className='row5_titles'>Time</label>
                    </div>
                    <div className='row5_event'>
                        <label className='row5_titles justleftitems'>Event Name</label>
                    </div>
                    <div className='row5_details'>
                        <label className='row5_titles justleftitems'>Details</label>
                    </div>
                </div>
                {Array.isArray(activities) && activities.map((act,index)=>(
                    <div id='rows_data_divs' key={index} style={{ backgroundColor: index % 2 === 0 ? 'rgb(77,77,77)' : 'inherit' }} onDoubleClick={()=>editor(act)}>
                        <div className='row5_date'>
                            <label className='row5_titles'>{act.date}</label>
                        </div>
                        <div className='row5_date'>
                            <label className='row5_titles'>{act.time}</label>
                        </div>
                        <div className='row5_event'>
                            <label className='row5_titles justleftitems2'>{act.event}</label>
                        </div>
                        <div className='row5_details'>
                            <label className='row5_titles justleftitems2'>{act.details}</label>
                        </div>
                    </div>
                ))}
                <div id='row5_inputs' hidden={!addItemVis && editItem}>
                    <div className='row5_date'>
                        <input maxLength='8' className='row5_titles row5_title2' placeholder='MM/DD/YY' value={newDate} onChange={(e)=>setNewDate(e.target.value)} onBlur={()=>dateBlur(newDate, setNewDate)}></input>
                    </div>
                    <div className='row5_date'>
                        <input maxLength='5' className='row5_titles row5_title2' placeholder='HH:MM' value={newTime} onChange={(e)=>setNewTime(e.target.value)}></input>
                    </div>
                    <div className='row5_event'>
                        <input className='row5_titles row5_title2 justleftitems2' placeholder='New Event' value={newEvent} onChange={(e)=>setNewEvent(e.target.value)}></input>
                    </div>
                    <div className='row5_details'>
                        <input className='row5_titles row5_title2 justleftitems2' placeholder='New Details' value={newDetails} onChange={(e)=>setNewDetails(e.target.value)}></input>
                    </div>
                </div>
            </div>
            <div id='r5_button_div'>
                <button id='r3_add_button' hidden={addItemVis || !editItem} onClick={()=>setAddItemVis(!addItemVis)}>Add Item</button>
                <button id='r3_save_button' hidden={!addItemVis || !editItem} onClick={()=>addAct()}>Save</button> 
                <button id='r3_cancel_button'hidden={!addItemVis || !editItem} onClick={()=>{setAddItemVis(!addItemVis);reset_labels()}}>Cancel</button>
            </div>
            <div id='row5_editor'>
                <button hidden={editItem} id='row5_saver' onClick={()=>SaveRow()} >Save</button> 
                <button hidden={editItem} id='row5_cancel' onClick={()=>cancelEditor()}>Cancel</button>
                <button hidden={editItem} id='row5_delete' onClick={()=>deleteItem()}>Delete</button>
            </div>

        </div>
    )
}

export default Row5; 