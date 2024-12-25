import React, {useContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './ToDoHero.css'
import { ToDoContext } from '../todo';

const ToDoHero = () => {

  const {todos}=useContext(ToDoContext)
  
  const total = todos ? todos.length : 0;
  var count = 0;
  for(let i = 0 ; i<total; i++){
      if(todos[i].completed ===true){
          count++
      }
  }


  

  return (
    <div>
        <div className='todoherobox'>
            <h1 className='todoherotitle'>Complete</h1>
            <div className='todobanner'>
                <h2 id='heroh2_1'>{count}</h2>
                <h2 id='heroh2_2'>/</h2>
                <h2 id='heroh2_3'>{todos ? todos.length : 0}</h2>
            </div>
        </div>
    </div>
  )
}

export default ToDoHero; 