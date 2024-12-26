import React, { useState, useEffect, createContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; //theme
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './todo.css'
import ToDoHero from './ToDoHero/ToDoHero';
import { fetchTodos } from './ToDoHero/ToDo_db_func';
import ToDoAdd from './ToDoAdd/todoadd.jsx';
import ToDoData from './ToDoData/tododata.jsx';

export const ToDoContext = createContext(null);

const ToDo = () => {

    const [todos, setToDos]=useState(null)
    const [loadingToDo, setLoadingToDo]=useState(true)
 
    useEffect(() => { //Use this to only allow loading of data one time
        fetchTodos(setToDos)
    }), [];

    const refresh = ()=>{

        fetchTodos(setToDos)

    }


    return (
        <div>
        <ToDoContext.Provider value ={{todos, refresh, setToDos}}>
            <ToDoHero />
            <ToDoAdd />
            <ToDoData />
        </ToDoContext.Provider>
        </div>
    )
}
  
export default ToDo; 