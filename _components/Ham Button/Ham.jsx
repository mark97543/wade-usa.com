import React from 'react'
import './Ham.css' // Assuming you have a CSS file for styling the Ham component


function Ham() {

    const hamFunction = (x) => {
        x.classList.toggle("change");
    }

  return (
    <div className='ham_container' onClick={(e) => hamFunction(e.currentTarget)}>
        <div className='bar1'></div>
        <div className='bar2'></div>
        <div className='bar3'></div>
    </div>
  )
}



export default Ham
