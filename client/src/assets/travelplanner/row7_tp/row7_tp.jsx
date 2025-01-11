import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import { TPContext } from '../travelplanner.jsx';
import './row7_tp.css';
import { AddFlight, DeleteFlight, EditFlight } from '../travelplanner_dbfunc.js';


const Row7 = () => {
    const {notes, setNotes, notesCK, selectedTrip}=useContext(TPContext)
    const [addItemVis, setAddItemVis]=useState(false)
    const [editItem, setEditItem]=useState(true)
    const [newNote, setNewNote]=useState("")
    const [rowID, setRowID]=useState("") //Curently Edited Row

    const reset_labels = ()=>{
        setNewNote("")
    }

    const addAct = ()=>{
        const data = {
            trip_id:selectedTrip ,
            note:newNote
        }

        AddFlight(data, 'notes')
        setAddItemVis(!addItemVis)
        reset_labels()
    }

    const editor = (note)=>{
        setEditItem(false)
        setNewNote(note.note)
        setRowID(note.id)
    }

    const cancelEditor = ()=>{
        setAddItemVis(false)
        reset_labels()
    }

    const SaveRow = ()=>{
        const data = {
            trip_id:selectedTrip,
            note:newNote,
            id:rowID
        }
        EditFlight(data, 'notes')
        setEditItem(true)
        reset_labels()
    }

    const deleteItem = ()=>{
        DeleteFlight(rowID, 'notes')
        setEditItem(true)
        reset_labels()
    }

    return (
        <div id='r7_out2_div' hidden={!notesCK}>
            <div id='r7_out_div'>
                <div id='row7_title'>
                    <label id='row7_title_label'>Notes</label>
                </div>
                <div className='row7_title_divs'>
                    <div className='row7_notenumber'>
                        <label className='row7_titles'>#</label>
                    </div>
                    <div className='row7_note'>
                        <label className='row7_titles row7_notes'>Note</label>
                    </div>
                </div>
                {Array.isArray(notes) && notes.map((note, index)=>(
                    <div key={index} className='row7_title_divs2' style={{ backgroundColor: index % 2 === 0 ? 'rgb(77,77,77)' : 'inherit' }} onDoubleClick={()=>editor(note)}>
                        <div className='row7_notenumber'>
                            <label className='row7_titles'>{index +1}</label>
                        </div>
                        <div className='row7_note'>
                            <label className='row7_titles row7_notes'>{note.note}</label>
                        </div>

                    </div>
                ))}

                <div className='row7_title_divs2' hidden={!addItemVis && editItem}>
                    <div className='row7_notenumber'>
                        <label className='row7_titles'></label>
                    </div>
                    <div className='row7_note'>
                        <input type='text' value={newNote} onChange={(e)=>setNewNote(e.target.value)} placeholder='New Note' className='row7_titles row7_notesin'></input>
                    </div>
                </div>
            </div>
            <div id='r7_button_div'>
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

export default Row7; 