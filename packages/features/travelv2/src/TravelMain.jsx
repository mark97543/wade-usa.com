import Travel_Home from './Travel_Home/Travel_Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Page404 from '../../home/src/404 page/404NotFound' //This needs to be imported from home. 
import Trip_Editor from './Trip_Editor/Trip_Editor'
import {RoleProtectedRoute} from '@wade-usa/auth'
import Editor_Page from './Trip_Editor/Editor_Page/Editor_Page'

function TravelMain() {
  return (
    <Routes>
      <Route path="/" element={<Travel_Home />} />
      {/* <Route path='/:link' element={<Trip_Display/>}/> */}


      <Route path='/trip-editor' element={
        <RoleProtectedRoute allowedRoles={['Administrator', 'Basic']}>
          <Trip_Editor />
        </RoleProtectedRoute>
      }/>

      <Route path='/editor-page/:tripID' element={
        <RoleProtectedRoute allowedRoles={['Administrator', 'Basic']}>
          <Editor_Page />
        </RoleProtectedRoute>
      }/>

      <Route path='*' element={<Page404/>}/> 
    </Routes>
  )
}

export default TravelMain