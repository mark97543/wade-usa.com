import axios from "axios";

const updateToDoComplete = async (item)=>{
    try{
        const sendData = {id:item.id, item: item.item ,completed:item.completed}
        //console.log(sendData)
        const response = await axios.post('/api/updatetodo', sendData)

    }catch(error){
        console.error('Error in the addTodo Function: ', error)
    }
}

const deleteToDo = async (item)=>{
    try{
        const sendData = {id:item}
        //console.log(sendData)
        const response = await axios.post('/api/deletetodo', sendData)

    }catch(error){
        console.error('Error in the addTodo Function: ', error)
    }
}

export {updateToDoComplete, deleteToDo};