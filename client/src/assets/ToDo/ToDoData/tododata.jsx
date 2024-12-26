import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './tododata.css'
import { ToDoContext } from '../todo';

const ToDoData = () => {
    const {todos, setToDos}=useContext(ToDoContext)

    if (!todos) {
        return <div>Loading...</div>; // Display loading message while data is fetched
    }

    if (todos.length === 0) {
        return <div>No todos yet</div>
    }

    const handleCheckboxChange = (id) => {
        setToDos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    console.log(todos)
    return (
        <div>
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
                        />
                    </div>
                    <button type="button" className="btn btn-info" id='tododeletebutton'>
                        ❌
                    </button>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDoData; 