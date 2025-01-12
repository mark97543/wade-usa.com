import React, {useState, createContext} from 'react';
import MapComponent from './map_baclground/map';

export const TripContext = createContext();//Create Context

const Mp = () => {



    return (
        <TripContext.Provider value={{}}>{/* Provide the trips and addTrip function */}
            <div>
                <MapComponent />
            </div>
        </TripContext.Provider>

    );
};

export default Mp;