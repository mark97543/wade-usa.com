import React, { useState, useEffect, createContext }from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css'; // Bootswatch CSS (must be before your custom CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS 
import './ToDoHero.css'


const ToDoHero = () => {
  return (
    <div>
        <div className='todoherobox'>
            <h1 className='todoherotitle'>Complete</h1>
            <div className='todobanner'>
                <h2 id='heroh2_1'>10</h2>
                <h2 id='heroh2_2'>/</h2>
                <h2 id='heroh2_3'>10</h2>
            </div>
        </div>
    </div>
  )
}

export default ToDoHero; 