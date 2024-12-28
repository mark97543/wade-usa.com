import axios from "axios";

/* ----- Purpose of this file is to handle all database requests/updates ---- */

const fetchUniquTrips = async (setTripNames) => {

    try {
        const response = await axios.get('/api/tpUnique');
        //console.log("Response from API:", response.data.rows)
        setTripNames(response.data.rows);
    } catch (error) {
        console.error('Error fetching trip names:', error);
    } 
    
};

const addNewTrip = async (data)=>{
    try{
        const sendData = {tripname:data, attribute:"tripname", detail:data}
        const response = await axios.post('/api/tpadd', sendData)
    }catch (error) {
        console.error('Error Adding Trip:', error);
    } 
}



export {fetchUniquTrips, addNewTrip}