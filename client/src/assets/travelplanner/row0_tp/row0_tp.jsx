import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row0_tp.css'


const Row0_TP = () => {
 
    
    return (
        <div id=''>

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



