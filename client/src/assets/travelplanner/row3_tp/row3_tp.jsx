import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row3_tp.css'
import { TPContext } from '../travelplanner';
import { AddFlight, DeleteFlight, EditFlight } from '../travelplanner_dbfunc';


const Row_3 = () => {
    const {hotelsChkd, hotels, selectedTrip}=useContext(TPContext)
    const [addItemVis, setAddItemVis]=useState(false)
    const [newCheckIn, setNewCheckIn]=useState("")
    const [newHotel, setNewHotel]=useState("")
    const [newAddress, setNewAddress]=useState("")
    const [newNumber, setNewNumber]=useState("")
    const [newCheckOut, setNewCheckOut]=useState("")
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

    const addHotel = ()=>{
        const data = {
            trip_id:selectedTrip ,
            checkin:newCheckIn ,
            name: newHotel,
            address: newAddress, 
            number: newNumber,
            checkout: newCheckOut
        }

        AddFlight(data, 'hotels')
        setAddItemVis(!addItemVis)
        setNewCheckIn("")
        setNewHotel("")
        setNewAddress("")
        setNewNumber("")
        setNewCheckOut("")
    }

    const editor = (hotel)=>{
        setRowID(hotel.id)
        setEditItem(false)
        setNewCheckIn(hotel.checkin)
        setNewHotel(hotel.name)
        setNewAddress(hotel.address)
        setNewNumber(hotel.number)
        setNewCheckOut(hotel.checkout)
    }

    const cancelEditor = ()=>{
        setAddItemVis(false)
        setEditItem(true)
        setNewCheckIn("")
        setNewHotel("")
        setNewAddress("")
        setNewNumber("")
        setNewCheckOut("")
    }

    const deleteItem = ()=>{
        DeleteFlight(rowID, 'hotels')

        setAddItemVis(false)
        setEditItem(true)
        setNewCheckIn("")
        setNewHotel("")
        setNewAddress("")
        setNewNumber("")
        setNewCheckOut("")
    }
    
    const SaveRow = ()=>{
        //console.log(rowID)

        const newData = {
            id:rowID,
            trip_id:selectedTrip ,
            checkin:newCheckIn ,
            name: newHotel,
            address: newAddress, 
            number: newNumber,
            checkout: newCheckOut
        
        }

        EditFlight(newData, 'hotels')

        setAddItemVis(false)
        setEditItem(true)
        setNewCheckIn("")
        setNewHotel("")
        setNewAddress("")
        setNewNumber("")
        setNewCheckOut("")
      
    }


    //console.log(hotels)
  return (
        <div hidden={!hotelsChkd} id='r2_out2_div'>
            <div id='r3_outside_div'>
                <div id='hotel_title'>
                        <label id='hotel_title_label'>Hotels</label>
                </div>
                <div id='row3_title_divs'>
                    <div className='row3_date'>
                        <label id='row3_checkin'>Check in</label>
                    </div>
                    <div className='row3_hotel_name'>
                        <label id='row3_name'>Hotel Name</label>
                    </div>
                    <div className='row3_address'>
                        <label id='row3_addr'>Address</label>
                    </div>
                    <div className='row3_number'>
                        <label id='row3_num'>Number</label>
                    </div>
                    <div className='row3_checkout'>
                        <label id='row3_co'>Check Out</label>
                    </div>
                </div>
                {Array.isArray(hotels) && hotels.map((hotel,index)=>(
                    <div id='rows_data_divs' key={index} style={{ backgroundColor: index % 2 === 0 ? 'rgb(77,77,77)' : 'inherit' }} onDoubleClick={()=>editor(hotel)}>
                        <div className='row3_date'>
                            <label className='row3_data_labels'>{hotel.checkin}</label>
                        </div>
                        <div className='row3_hotel_name'>
                            <label className='row3_data_labels'>{hotel.name}</label>
                        </div>
                        <div className='row3_address'>
                            <label className='row3_data_labels'>{hotel.address}</label>
                        </div>
                        <div className='row3_number'>
                            <label className='row3_data_labels'>{hotel.number}</label>
                        </div>
                        <div className='row3_checkout'>
                            <label className='row3_data_labels'>{hotel.checkout}</label>
                        </div>
                    </div>
                ))}
                <div id='row3_inputs' hidden={!addItemVis && editItem}>
                    <div className='row3_date'>
                            <input className='row3_inputs' type='text' placeholder='mm/dd/yy' value={newCheckIn} onBlur={()=>dateBlur(newCheckIn, setNewCheckIn)} onChange={(e)=>setNewCheckIn(e.target.value)}></input>
                    </div>
                    <div className='row3_hotel_name'>
                            <input className='row3_inputs' type='text' placeholder='New Hotel' value={newHotel} onChange={(e)=>setNewHotel(e.target.value)} ></input>
                    </div>
                    <div className='row3_address'>
                            <textarea rows='1' className='row3_inputs' type='text' placeholder='New Address' value={newAddress} onChange={(e)=>setNewAddress(e.target.value)} ></textarea>
                    </div>
                    <div className='row3_number'>
                            <input className='row3_inputs' type='text' placeholder='New Number' value={newNumber} onChange={(e)=>setNewNumber(e.target.value)} ></input>
                    </div>
                    <div className='row3_checkout'>
                            <input className='row3_inputs' type='text' placeholder='mm/dd/yy' value={newCheckOut} onChange={(e)=>setNewCheckOut(e.target.value)} onBlur={()=>dateBlur(newCheckOut, setNewCheckOut)} ></input>
                    </div>
                </div>
            </div>
            <div id='r3_button_div'>
                <button id='r3_add_button' hidden={addItemVis || !editItem} onClick={()=>setAddItemVis(!addItemVis)}>Add Item</button>
                <button id='r3_save_button' hidden={!addItemVis || !editItem} onClick={()=>addHotel()}>Save</button> 
                <button id='r3_cancel_button'hidden={!addItemVis || !editItem} onClick={()=>setAddItemVis(!addItemVis)}>Cancel</button>
            </div>
            <div id='row2_editor'>
                <button hidden={editItem} id='row2_saver' onClick={()=>SaveRow()} >Save</button> 
                <button hidden={editItem} id='row2_cancel' onClick={()=>cancelEditor()}>Cancel</button>
                <button hidden={editItem} id='row2_delete' onClick={()=>deleteItem()}>Delete</button>
            </div>
        </div>
  )
}

export default Row_3; 