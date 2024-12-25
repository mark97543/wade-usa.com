import React, { useState, useEffect, createContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './todo.css'
import ToDoHero from './ToDoHero/ToDoHero';

export const ToDoContext = createContext(null);

const ToDo = () => {

    return (
        <div>
        <ToDoContext.Provider value ={{}}>
            <ToDoHero />
        </ToDoContext.Provider>
        </div>
    )
}
  
export default ToDo; 