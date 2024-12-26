import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './todoadd.css'
import addTodo from './todoadd_dbfunc';
import { ToDoContext } from '../todo';

const ToDoAdd = () => {
  const {setLoadingToDo}=useContext(ToDoContext)

    const [addInputValue, setAddInputValue] = useState('');
    
    const onaddbutton = ()=>{
        addTodo(addInputValue)
        setLoadingToDo(true)
        setAddInputValue('')
    }
  
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { // Check if the "Enter" key was pressed
           e.preventDefault() // stops from refreshing the page
            onaddbutton() // trigger onaddbutton event
        }
    }

    return (
    <div className='todoadddiv'>
        <input 
            type="text" 
            className="form-control" 
            placeholder="New To Do Item" 
            id="todoaddinput" 
            value={addInputValue}
            onChange={(e)=>setAddInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
        />
        <button 
            type="button" 
            className="btn btn-info" 
            id='todoaddbutton'
            onClick={onaddbutton}>+</button>
    </div>
  )
}

export default ToDoAdd; 