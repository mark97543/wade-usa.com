import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import Row0_TP from './row0_tp/row0_tp.jsx';
export const TPContext = createContext(null);


const TravelPlanner = () => {




    return (
        <div>
            <TPContext.Provider value ={{}}>
                <Row0_TP />
            </TPContext.Provider>
        </div>
    )
    }

export default TravelPlanner; 