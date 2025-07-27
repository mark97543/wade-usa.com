import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTripsBySlug } from '@wade-usa/auth'
import './Slug.css'

function Slug() {
  const { slug } = useParams() // Correctly destructure 'slug' to match the route parameter

  //TODO: Need to see if user is logged in and if they are go to the editor page. 


  return (
    <div>
      <h1>{`Slug: ${slug}`}</h1>
    </div>
  )
}

export default Slug