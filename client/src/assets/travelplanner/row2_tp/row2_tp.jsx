import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row2_tp.css'
import { TPContext } from '../travelplanner';

const Row2_tp = () => {
    const {}=useContext(TPContext)


    return (
        <div id='r2_out_div'>
            <div id='dep_flight_div'>
                <label id='dep_flight_label'>Departing Flights</label>
            </div>

            <div id='row2_table_div'>
                <div className='r2_date_div'>
                    <label className='r2_basic_label' >Date</label>
                </div>
            </div>

            <div className='r2_date_div'>
                <input id='r2_date_input' type='text'></input>
            </div>

            <div>
                <label className='r2_basic_label'>H</label>
            </div>

        </div>
    )
}

export default Row2_tp; 