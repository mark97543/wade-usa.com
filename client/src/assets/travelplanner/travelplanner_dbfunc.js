import axios from "axios";

const getAllTP = async(setTPData)=>{
    try {
        const response = await axios.get('/api/trips');
        //console.log("Response from API:", response.data.rows[0])
        setTPData(response.data.rows);
    } catch (error) {
        console.error('Error with getAllTP Function on Client Side:', error);
    }  
}

const deleteTrip = async(id)=>{
    try {
        const data = {id:id}
        await axios.post('/api/deletetrip', data);
    } catch (error) {
        console.error('Error with deleteTrip function on the client side', error);
    }  
}

const addTrip = async(item)=>{
    try{
        const data = {data:item}
        const response = await axios.post("/api/addtrip", data);
        return response.data.rows[0].id
    }catch(error){
        console.error('Error with the addTrip on the Client Side: ', error)
    }
}

const updateTrip = async(data)=>{
    try{
        await axios.post('/api/updatetrip',data)
    }catch(error){
        console.error('Error wit the updateTrip on the client side: ', error)
    }
}

const TravelInfo = async(trip, table) =>{ //Generic Quary return all items in a table with the trip ID of selected trip. 
    if(trip!="" && trip!='new'){
        const data = {trip: trip, table:table}
        try{
            const response = await axios.post('/api/travelinfo', data)
            //console.log(response.data.rows)
            return response.data.rows
        }catch(error){
            console.error('Error with TravelInfo Function on the client side: ', error)
        }
    }
}

const AddFlight = async (data, table)=>{
    const send = {data:data, table:table}
    try{
        await axios.post('/api/addflight', send)
    }catch(error){
        console.error('Error with Add Flight function on the Client Side')
    }
}

const EditFlight = async (data, table)=>{
    const send = {data:data, table:table}
    try{
        await axios.post('/api/editflight', send)
    }catch(error){
        console.error('Error with EditFlight on the Client Side: ', error)
    }
}

const DeleteFlight = async(id, table)=>{
    const send = {id:id, table:table}
    try{
        await axios.post('/api/deleteflight', send)
    }catch(error){
        console.error('Error wirh DeleteFlight Function on the client side: ', error)
    }
}

export {getAllTP, deleteTrip, addTrip, updateTrip, TravelInfo, AddFlight, EditFlight,DeleteFlight}