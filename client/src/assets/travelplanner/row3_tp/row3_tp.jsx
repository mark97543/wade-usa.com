import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row3_tp.css'
import { TPContext } from '../travelplanner';


const Row_3 = () => {
    const {hotelsChkd, hotels}=useContext(TPContext)

    console.log(hotels)
  return (
        <div hidden={!hotelsChkd}>
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
                    <div className='row3_note'>
                        <label id='row3_n'>Notes</label>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Row_3; 