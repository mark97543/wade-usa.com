import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row4_tp.css'
import { TPContext } from '../travelplanner';
import { AddFlight, DeleteFlight, EditFlight } from '../travelplanner_dbfunc';

const Row4 = () => {
    const {rCChkd, rCars, selectedTrip}=useContext(TPContext)
    const [newPU, setNewPU]=useState("")
    const [newPUTime, setNewPUTime]= useState("")
    const [newCompany, setNewCompnay]=useState("")
    const [newLocation, setNewLocation]=useState("")
    const [newReturn, setNewReturn]=useState("")
    const [newReturnTime, setNewReturnTime]=useState("")
    const [addItemVis, setAddItemVis]=useState(false)
    const [editItem, setEditItem]=useState(true)
    const [rowID, setRowID]=useState("") //Curently Edited Row

    const dateBlur = (value, setter)=>{
        const a = new Date (value)
        const mm = String(a.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const dd = String(a.getDate()).padStart(2, '0');
        const yy = String(a.getFullYear()).slice(-2);
        //console.log(`${mm}/${dd}/${yy}`);
        setter(`${mm}/${dd}/${yy}`)
    }

    const addRC = ()=>{
        const data = {
            trip_id: selectedTrip,
            pu: newPU,
            putime: newPUTime,
            company: newCompany,
            location: newLocation,
            return:newReturn,
            returntime:newReturnTime
        }
        AddFlight(data, 'rc')
        setAddItemVis(!addItemVis)
        setNewPU("")
        setNewPUTime("")
        setNewCompnay("")
        setNewLocation("")
        setNewReturn("")
        setNewReturnTime("")
    }

    const editor = (rCar)=>{
        setRowID(rCar.id)
        setEditItem(false)
        setNewPU(rCar.pu)
        setNewPUTime(rCar.putime)
        setNewCompnay(rCar.company)
        setNewLocation(rCar.location)
        setNewReturn(rCar.return)
        setNewReturnTime(rCar.returntime)
    }

    const cancelEditor = ()=>{
        setEditItem(true)
        setNewPU("")
        setNewPUTime("")
        setNewCompnay("")
        setNewLocation("")
        setNewReturn("")
        setNewReturnTime("")
    }

    const deleteItem = ()=>{
        DeleteFlight(rowID, 'rc')
        cancelEditor()
    }

    const SaveRow = ()=>{
        const data = {
            id:rowID,
            trip_id: selectedTrip,
            pu: newPU,
            putime: newPUTime,
            company: newCompany,
            location: newLocation,
            return:newReturn,
            returntime:newReturnTime
        }
        EditFlight(data, 'rc')
        cancelEditor()
    }

    return (
        <div hidden={!rCChkd} id='r4_outside_div'>
            <div id='r3_outside_div'>
                <div id='hotel_title'>
                        <label id='hotel_title_label'>Rental Cars</label>
                </div>
                <div id='row4_title_divs'>
                    <div className='row4_pickup'>
                        <label className='row4_header'>Pickup</label>
                    </div>
                    <div className='row4_puTime'>
                        <label className='row4_header'>Time</label>
                    </div>
                    <div className='row4_company'>
                        <label className='row4_header'>Company Name</label>
                    </div>
                    <div className='row4_location'>
                        <label className='row4_header'>Location</label>
                    </div>
                    <div className='row4_pickup'>
                        <label className='row4_header'>Drop Off</label>
                    </div>
                    <div className='row4_puTime'>
                        <label className='row4_header' id='row4_Time2'>Time</label>
                    </div>
                </div>
                {Array.isArray(rCars) && rCars.map((rCar, index)=>(
                    <div id='rows_data_divs' key={index} style={{ backgroundColor: index % 2 === 0 ? 'rgb(77,77,77)' : 'inherit' }} onDoubleClick={()=>editor(rCar)}>
                        <div className='row4_pickup'>
                            <label className='row4_header'>{rCar.pu}</label>
                        </div>
                        <div className='row4_puTime'>
                            <label className='row4_header'>{rCar.putime}</label>
                        </div>
                        <div className='row4_company'>
                            <label className='row4_header'>{rCar.company}</label>
                        </div>
                        <div className='row4_location'>
                            <label className='row4_header'>{rCar.location}</label>
                        </div>
                        <div className='row4_pickup'>
                            <label className='row4_header'>{rCar.return}</label>
                        </div>
                        <div className='row4_puTime'>
                            <label className='row4_header' id='row4_Time2'>{rCar.returntime}</label>
                        </div>
                    </div>
                ))}
                <div id='row3_inputs' hidden={!addItemVis && editItem}>
                    <div className='row4_pickup'>
                        <input placeholder="MM/DD/YY" value={newPU} onChange={(e)=>setNewPU(e.target.value)} className='row4_input' onBlur={()=>dateBlur(newPU, setNewPU)} ></input>
                    </div>
                    <div className='row4_puTime'>
                        <input maxLength='5' className='row4_input' placeholder='HH:MM' value={newPUTime} onChange={(e)=>setNewPUTime(e.target.value)}></input>
                    </div>
                    <div className='row4_company'>
                        <input className='row4_input' placeholder='New Company' value={newCompany} onChange={(e)=>setNewCompnay(e.target.value)}></input>
                    </div>
                    <div className='row4_location'>
                        <input className='row4_input' placeholder='New Location' value={newLocation} onChange={(e)=>setNewLocation(e.target.value)}></input>
                    </div>
                    <div className='row4_pickup'>
                        <input className='row4_input' placeholder='MM/DD/YY' value={newReturn} onChange={(e)=>setNewReturn(e.target.value)} onBlur={()=>dateBlur(newReturn, setNewReturn)} ></input>
                    </div>
                    <div className='row4_puTime'>
                        <input maxLength='5' className='row4_input' id='row4_Time2' placeholder='HH:MM' value={newReturnTime} onChange={(e)=>setNewReturnTime(e.target.value)}></input>
                    </div>
                </div>
            </div>
            <div id='r4_button_div'>
                <button id='r4_add_button' hidden={addItemVis || !editItem} onClick={()=>setAddItemVis(!addItemVis)} >Add Item</button>
                <button id='r4_save_button' hidden={!addItemVis || !editItem} onClick={()=>addRC()}>Save</button> 
                <button id='r4_cancel_button' hidden={!addItemVis || !editItem} onClick={()=>{setAddItemVis(!addItemVis)
                        setNewPU("")
                        setNewPUTime("")
                        setNewCompnay("")
                        setNewLocation("")
                        setNewReturn("")
                        setNewReturnTime("")
                }}>Cancel</button>
            </div>
            <div id='row2_editor'>
                <button hidden={editItem} id='row2_saver' onClick={()=>SaveRow()} >Save</button> 
                <button hidden={editItem} id='row2_cancel' onClick={()=>cancelEditor()}>Cancel</button>
                <button hidden={editItem} id='row2_delete' onClick={()=>deleteItem()}>Delete</button>
            </div>
        </div>
    )
}

export default Row4; 