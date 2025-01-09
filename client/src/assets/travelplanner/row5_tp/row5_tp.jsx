import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import { TPContext } from '../travelplanner';
import './row5_tp.css'

const Row5 = () => {
  const {actchkd, activities}=useContext(TPContext)


    return (
        <div hidden={!actchkd} id='r5_out2_div'>
            <div id='r5_outside_div'>
                <div id='row5_title'>
                    <label id='row5_title_label'>Activities</label>
                </div>
            </div>
        </div>
    )
}

export default Row5; 