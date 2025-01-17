import React, {useState, createContext} from 'react';
import MapComponent from './map_baclground/map';
import LeftBar from './mp_left_bar/left_bar';
import './mp.css'

export const TripContext = createContext();//Create Context

const Mp = () => {



    return (
        <TripContext.Provider value={{}}>{/* Provide the trips and addTrip function */}
            <div id='app_container'>
                <div id="map-left-wrapper"> 
                    <LeftBar/>
                    <MapComponent />

                </div>
            </div>
            
        </TripContext.Provider>

    );
};

export default Mp;