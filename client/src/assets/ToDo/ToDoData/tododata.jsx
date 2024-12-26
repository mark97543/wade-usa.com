import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './tododata.css'
import { ToDoContext } from '../todo';
import { updateToDoComplete, deleteToDo } from './tododata_dbfunc';

const ToDoData = () => {
    const {todos, setToDos}=useContext(ToDoContext)

    if (!todos) {
        return <div>Loading...</div>; // Display loading message while data is fetched
    }

    if (todos.length === 0) {
        return <div>No todos yet</div>
    }

    const handleCheckboxChange = (id) => {
        const currentTodo = todos.find(todo => todo.id === id)
        const newtoggle = !currentTodo.completed
        currentTodo.completed = newtoggle
        updateToDoComplete(currentTodo)
    };

    const deleteClick = (id)=>{
        deleteToDo(id)
    }

    const editData= (id)=>{
        const deleteButton = 'tododeletebutton-'+id
        const saveButton = 'todosavebutton-'+id
        document.getElementById(deleteButton).hidden = true;
        document.getElementById(saveButton).hidden = false;
    }

    const saveButton = (id)=>{
        const deleteButton = 'tododeletebutton-'+id
        const saveButton = 'todosavebutton-'+id
        document.getElementById(deleteButton).hidden = false;
        document.getElementById(saveButton).hidden = true;
        savingEdit(id)
    }

    const savingEdit = (id)=>{       
        const deleteButton = 'tododeletebutton-'+id
        const saveButton = 'todosavebutton-'+id
        const input = 'todoinput-'+id
        document.getElementById(deleteButton).hidden = false;
        document.getElementById(saveButton).hidden = true;
        const currentTodo = todos.find(todo =>todo.id === id)
        const newItem = document.getElementById(input).value
        currentTodo.item = newItem
        updateToDoComplete(currentTodo)
    }

    return (
        <div id="todohomediv">
            <ul>
                {todos.map((todo, index)=>(
                    <li id='tododisplay' key={todo.id}>
                    <input
                        className="form-check-input todocheckbox"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleCheckboxChange(todo.id)}
                    />
                    <div id='todoeffect'>
                        <input
                            type="text"
                            className="form-control tododatainput"
                            placeholder="Default input"
                            defaultValue={todo.item} 
                            maxLength='33'
                            onFocus={()=>editData(todo.id)}
                            onBlur={()=>savingEdit(todo.id)}
                            id={`todoinput-${todo.id}`}
                        />
                    </div>
                    <button hidden={false} type="button" className="btn btn-info tododeletebutton" id={`tododeletebutton-${todo.id}`} onClick={()=>deleteClick(todo.id)}>
                        ❌
                    </button>
                    <button hidden={true} type="button" className="btn btn-info tododeletebutton" id={`todosavebutton-${todo.id}`} onClick={()=>saveButton(todo.id)}>
                        ✅
                    </button>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDoData; 