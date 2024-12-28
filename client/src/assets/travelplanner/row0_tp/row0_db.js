import axios from "axios";

const deleteTrip=async(data)=>{
    
    try{
        const sendData = {tripname:data}
        //console.log(sendData)
        const response = await axios.post('/api/deletetrip', sendData)
    }catch(error){
        console.error('Error Deleteing Trip: ', error)
    }
}

export {deleteTrip}