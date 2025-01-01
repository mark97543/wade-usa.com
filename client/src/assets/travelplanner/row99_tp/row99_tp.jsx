import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row99_tp.css'
import { TPContext } from '../travelplanner';

const Row99_tp = () => {
    const {selectedTrip}=useContext(TPContext)

    //Need Use State to edit this and make invisible during 


    return (
        <div id='row99_div'>
            <button id='r99_edit_button'>Edit Trip</button>
        </div>
    )
}

export default Row99_tp; 