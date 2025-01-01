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
        setAddEntry("")
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










// const Row0_TP = () => {
//     const [r0_ButtonToggle, setR0_ButtonToggle] = useState(false);
//     const { tripNames, refresh, setSelectedTrip, selectedTrip } = useContext(TPContext);
//     const [selecttrip, setSeectTrip] = useState(false);
//     const [addstuff, setAddStuff] = useState(true);
//     const [newTripName, setNewTripName] = useState("");
//     //const [selectedTripValue, setSelectedTripValue] = useState("");

//     // const deleteselect = () => {
//     //     setR0_ButtonToggle(true);
//     // };

//     // const cancelDeleteButton = () => {
//     //     setR0_ButtonToggle(false);
//     // };

//     // const deleteYES = () => {
//     //     if (selecttrip === false) {
//     //         alert("Come On!!!: You Cannot Delete the Base Option");
//     //         return;
//     //     } else {
//     //         setR0_ButtonToggle(false);
//     //         deleteTrip(selectedTripValue);
//     //         setSeectTrip(false);
//     //          refresh(selectedTripValue);
//     //     }
//     // };

//     const selectChange = async (e) => {
//         const value = e.target.value;
//          setSelectedTripValue(value)
//         if (value === "Add Trip") {
//             setAddStuff(false);
//             setR0_ButtonToggle(false);
//             setSelectedTrip(value)
//         } else {
//             setAddStuff(true);
//              setSelectedTrip(value)
//             refresh(value);
//         }
//         setSeectTrip(true);
//     };

//     // const addCancel = () => {
//     //     setAddStuff(true);
//     //     setNewTripName("");
//     //     setR0_ButtonToggle(false);
//     //     setSeectTrip(false);
//     //     document.getElementById('row0select').value = "";
//     // };

//     // const addTrip = async () => {
//     //     const newdest2 = newTripName.toLowerCase();
//     //     const copy = tripNames.some(trip => trip.tripname.toLowerCase() === newdest2);
//     //     if (copy === true) {
//     //         alert("No Bueno: Trip Name Already Exists");
//     //         return;
//     //     }
//     //     setAddStuff(true);
//     //     addNewTrip(newTripName);
//     //     setSeectTrip(false);
//     //     document.getElementById('row0select').value = "";
//     //      setNewTripName("")
//     //     refresh();
//     // };

//     return (
//         <div id='row0TPMainDiv'>
//             <select
//                 className="form-select"
//                 id="row0select"
//                 onChange={(e) => {
//                     selectChange(e);
//                 }}
//                 value={selectedTripValue}
//             >
//                 <option value="" hidden={selecttrip}>
//                     Select A Trip
//                 </option>
//                 {tripNames.map((trip, index) => (
//                     <option key={index} value={trip.tripname}>
//                         {trip.tripname}
//                     </option>
//                 ))}
//                 <option>Add Trip</option>
//             </select>
// {/*}            <div hidden={!addstuff}>
//                 <button type="button" className="btn btn-info" id='row0_deleteButton' hidden={r0_ButtonToggle} onClick={deleteselect}>
//                     Delete Trip
//                 </button>
//             </div>
//             <div id="row0deleteselector">
//                 <button type="button" className="btn btn-danger" id='row0_surebutton' hidden={!r0_ButtonToggle} onClick={deleteYES}>
//                     Confirm
//                 </button>
//                 <button type="button" className="btn btn-success" id='row0_cancelbutton' hidden={!r0_ButtonToggle} onClick={cancelDeleteButton}>
//                     Cancel
//                 </button>
//             </div>
//             <div hidden={addstuff} id="additemdiv">
//                 <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter New Trip Name"
//                     id='addtripentry'
//                     value={newTripName}
//                     onChange={(e) => setNewTripName(e.target.value)}
//                 />
//                 <div id='addbuttondiv'>
//                     <button type="button" className="btn btn-success addbuttons" onClick={addTrip}>
//                         Add
//                     </button>
//                     <button type="button" className="btn btn-danger addbuttons" onClick={addCancel}>
//                         Cancel
//                     </button>
//                 </div>
//             </div> */}
//         </div>
//     );
// };

// export default Row0_TP;



