import React from 'react'
import {useAuth} from '@wade-usa/auth'
import {useNavigate} from 'react-router-dom'
import './Travel_Home.css'


function Travel_Home() {

  const {user, isLoggedIn} = useAuth()
  const allowedRoles = ['Administrator','Basic']
  const navigate = useNavigate()

  //Navigate to Trip Editor 
  const handleAddTrip=()=>{
    navigate('trip-editor')
  }

  return (
    <div className='travel-home-container'>
      <h1>Upcomming Trips</h1>

      {isLoggedIn && allowedRoles.includes(user?.role?.name) ? <button onClick={handleAddTrip}>Add Trip</button> : ""}

      <div>Travel_Home</div>

    </div>

  )
}

export default Travel_Home