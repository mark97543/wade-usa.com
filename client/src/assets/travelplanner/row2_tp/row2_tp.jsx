import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './row2_tp.css'
import { TPContext } from '../travelplanner';

const Row2_tp = () => {
    const {depFlight, depFlightChkd}=useContext(TPContext)
    const [hide, setHide]=useState(true)
    
    useEffect(()=>{
        try{
            if(depFlight.length > 0 && depFlightChkd===true){
                setHide(false)
            }else if(depFlightChkd === false){
                setHide(true)
            }else if(depFlightChkd===true){
                setHide(false)
            }
        }catch(error){
            setHide(true)
        }

    },[depFlight, depFlightChkd])

    

    return (
        <div id='r2_out_div' hidden={hide}>
            <div id='dep_flight_div'>
                <label id='dep_flight_label'>Departing Flights</label>
            </div>

            <div id='row2_table_div'>
                <div className='r2_date_div'>
                    <label className='r2_basic_label' >Date</label>
                </div>
                <div className='r2_origin_div'>
                    <label className='r2_basic_label'>Origin</label>
                </div>
                <div className='r2_airline_div'>
                    <label className='r2_basic_label'>Airline</label>
                </div>
                <div className='r2_flight_div'>
                    <label className='r2_basic_label'>Flight</label>
                </div>
                <div className='r2_depart_div'>
                    <label className='r2_basic_label'>Depart</label>
                </div>
                <div className='r2_dest_div'>
                    <label className='r2_basic_label'>Dest</label>
                </div>
                <div className='r2_land_div'>
                    <label className='r2_basic_label'>Land</label>
                </div>
                <div className='r2_note_div'>
                    <label className='r2_basic_label'>Note</label>
                </div>

            </div>

            {Array.isArray(depFlight) && depFlight.map((flight,index)=>(
                <div 
                    id='r2_data_div' 
                    key={index}
                    style={{ backgroundColor: index % 2 === 0 ? 'rgb(77,77,77)' : 'inherit' }}
                >

                    <div className='r2_date_div' >
                        <label id='r2_date_input' type='text'>{flight.date}</label>
                    </div>

                    <div className='r2_origin_div'>
                        <label id='r2_origin_label'>{flight.origin}</label>
                    </div>

                    <div className='r2_airline_div'>
                        <label id='r2_airline_label'>{flight.airline}</label>
                    </div>

                    <div className='r2_flight_div'>
                        <label id='r2_flight_label'>{flight.flight}</label>
                    </div>

                    <div className='r2_depart_div'>
                        <label id='r2_depart_label'>{flight.depart}</label>
                    </div>

                    <div className='r2_dest_div'>
                        <label id='r2_dest_label'>{flight.dest}</label>
                    </div>

                    <div className='r2_land_div'>
                        <label id='r2_land_label'>{flight.land}</label>
                    </div>
                    <div className='r2_note_div'>
                        <label id='r2_note_label'>{flight.land}</label>
                    </div>

                </div>
            ))}
            <div id='r2_bottom'>
                <label className='r2_basic_label'></label>
            </div>

        </div>
    )
}

export default Row2_tp; 