import Travel_Home from './Travel_Home/Travel_Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

function TravelMain() {
  return (
    <Routes>
      <Route path="/" element={<Travel_Home />} />
    </Routes>
  )
}

export default TravelMain