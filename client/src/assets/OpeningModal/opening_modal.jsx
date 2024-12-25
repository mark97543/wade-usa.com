import React, { useState, useEffect } from 'react';
import "./opening_modal.css"
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'; // This is still needed for styling
import './opening_modal.css';
import jsonData from './opening_modal.json'; // Import JSON directly


//import jsonData from './modal.json'; // Import JSON directly

const Greeting = ({ show, onClose })=>{

    const message = dateDraw({data:jsonData});

    return(
        <Modal show={show} onHide={onClose} centered> {/* Added centered for better positioning */}

            <Modal.Title className='openingmodaltitle'>My Deerest Fa,</Modal.Title>
            <Modal.Body className='openingmocalmessage'>{message}</Modal.Body>
            <Modal.Body className='openingmocalfoot'>Your Loving Husband, </Modal.Body>
            <Modal.Body className='openingmocalfoot'>Mark Jr. </Modal.Body>
        </Modal>
    )
}

const dateDraw = ({data})=>{
    const today = todayDate({})
    //const today = "12/23/25"//Testing Different Dates
    var message = "Nothing to Report (This may be Error Cause I love you SO much and Would not forget this)"

    if (!data || data.length === 0) {
        return { message: "No data available.", today: todayDate };
    }

    for(let i=0; i<data.length;i++){
        if(today === data[i].date){
            return message = data[i].message
        }
    }
    return  message
}


const todayDate = ({})=>{
    const date = new Date()
    // Options object for formatting (adjust as needed)
    const options = {
        year: '2-digit',    // 'numeric', '2-digit'
        month: '2-digit',     // 'numeric', '2-digit', 'long', 'short', 'narrow'
        day: '2-digit'      // 'numeric', '2-digit'
    };

    const today = date.toLocaleDateString('en-US',options)

    return today
}

export default Greeting;

