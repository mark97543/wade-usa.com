import axios from "axios";

const addTodo = async (data)=>{
    try{
        const sendData = {item:data, completed:false}
        const response = await axios.post('/api/addtodo', sendData)

    }catch(error){
        console.error('Error in the addTodo Function: ', error)
    }
}

export default addTodo;