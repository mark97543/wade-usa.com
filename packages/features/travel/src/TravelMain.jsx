import Travel_Home from './Travel_Home/Travel_Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Page404 from '../../home/src/404 page/404NotFound' //This needs to be imported from home. 

function TravelMain() {
  return (
    <Routes>
      <Route path="/" element={<Travel_Home />} />

      <Route path='*' element={<Page404/>}/> 
    </Routes>
  )
}

export default TravelMain