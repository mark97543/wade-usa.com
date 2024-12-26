import React, { useState, useEffect, createContext, useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './tododata.css'
import { ToDoContext } from '../todo';

const ToDoData = () => {
  const {todos}=useContext(ToDoContext)


  return (
    <div id='tododisplay'>
        <input className="form-check-input todocheckbox" type="checkbox" value="" ></input>
        <div id='todoeffect'> 
            <input type="text" className="form-control tododatainput" placeholder="Default input"></input>
        </div>
        <button 
            type="button" 
            className="btn btn-info" 
            id='tododeletebutton'
            >❌
        </button>

    </div>
  )
}

export default ToDoData; 