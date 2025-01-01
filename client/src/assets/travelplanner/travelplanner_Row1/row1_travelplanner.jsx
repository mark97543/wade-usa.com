import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row1_tp.css'
import { TPContext } from '../travelplanner';
import { updateTrip } from '../travelplanner_dbfunc';

const Row1_TP = () => {
    const {tpData, selectedTrip, setTPData}=useContext(TPContext)
    const [hideRow, setHideRow]=useState(false)//Hide entire row based on no trip selected. 
    const [editSelect, setEditSelect]=useState(false)//Save Function visability (Inputs work off thie as well)
    const [destInput, setDestInput]=useState("")//Setting the desitination input value
    const [sdInput, setSDInput]=useState("") // Startdate Input data
    const [edInput, setEDInput]=useState("")//Edit Items for end date


    const loadedTrip = tpData && Array.isArray(tpData) && selectedTrip ? tpData.find((trip) => trip.id === selectedTrip) : null; //Searches for loaded trip info

    useEffect(()=>{//This Hides the entire Row 0 if there is nothing selected. We will do the same on Other rows but also include any Data Relevent. 
        if(selectedTrip==="" || selectedTrip==="new"){
            setHideRow(true)
        }else{
            setHideRow(false)
        }
        setDestInput(loadedTrip?.tripname)
        setSDInput(loadedTrip?.startdate)
        setEDInput(loadedTrip?.enddate)
        console.log(selectedTrip)
    }, [selectedTrip]) 

    const cancelEdit = ()=>{
        setDestInput(loadedTrip?.tripname || "No trip Selected")
        setSDInput(loadedTrip?.startdate)
        setEDInput(loadedTrip?.enddate)
    }

    const saveEdit=()=>{
        const data = {
            id:selectedTrip,
            tripname:destInput,
            startdate:sdInput,
            enddate:edInput
        }
        const newID=selectedTrip
        updateTrip(data)
        setSelectedTrip(newID)
        
    }

    return (
        <div id='row1_tp' hidden={hideRow}>
            <div id='r1_tpdiv' hidden={hideRow}>
                <div id='r1c1_tp'>
                    <label className='r1labels_tp'>Desitnation</label>
                    <label hidden={editSelect}>{loadedTrip?.tripname || "No trip Selected"}</label>
                    <input className='r1_edit_inputs' type='text' hidden={!editSelect} value={destInput} onChange={(e)=>setDestInput(e.target.value)}></input>
                </div>

                <div id='r1c2_tp'>
                    <label className='r1labels_tp'>Start Date</label>
                    <label hidden={editSelect}>{loadedTrip?.startdate || "No Date"}</label>
                    <input className='r1_edit_inputs' type='text' hidden={!editSelect} value={sdInput} onChange={(e)=>setSDInput(e.target.value)}></input>
                </div>

                <div id='r1c3_tp'>
                    <label className='r1labels_tp'>End Date</label>
                    <label hidden={editSelect}>{loadedTrip?.enddate || "No Date"}</label>
                    <input className='r1_edit_inputs' type='text' hidden={!editSelect} value={edInput} onChange={(e)=>setEDInput(e.target.value)}></input>
                </div>


            </div>

            <div id='r1c4_tp'>
                    <button id='r1_edit_button_tp' hidden={editSelect} onClick={()=>{setEditSelect(!editSelect);
                                setDestInput(loadedTrip?.tripname)
                                setSDInput(loadedTrip?.startdate)
                                setEDInput(loadedTrip?.enddate)
                    }}>Edit</button>
                    <button id='r1_save_button_tp'hidden={!editSelect} onClick={()=>{setEditSelect(!editSelect), saveEdit()}}>Save</button> {/* Need to Execute a save command here. 2). Need to set the values of the labels here as well */}
                    <button id='r1_cancel_button_tp'hidden={!editSelect} onClick={()=>{setEditSelect(!editSelect); cancelEdit()}}>Cancel</button>
            </div>

        </div>
    )
}

export default Row1_TP; 