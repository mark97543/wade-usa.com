import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row1_tp.css'
import { TPContext } from '../travelplanner';

const Row1_TP = () => {
    const {tpData, selectedTrip, loadedTrip}=useContext(TPContext)
    
    //console.log(selectedTrip)
    //const loadedTrip = tpData.find((trip) => trip.id === selectedTrip);//Finds CUrrent Item info

    //console.log(loadedTrip)

    // if(tpData && tpData.length>0){
    //     const loadedTrip = tpData.find((trip) => trip.id === selectedTrip);//Finds CUrrent Item info
    //     //console.log(loadedTrip)
    // }
    console.log(loadedTrip)

    return (
        <div id='r1_tpdiv'>
            <div id='r1c1_tp'>
                <label className='r1labels_tp'>Desitnation</label>
                <label value={loadedTrip.tripname}>Desitnation</label>
            </div>
        </div>
    )
}

export default Row1_TP; 