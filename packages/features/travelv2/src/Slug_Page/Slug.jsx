import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTripsBySlug } from '@wade-usa/auth'
import './Slug.css'

function Slug() {
  const { slug } = useParams() // Correctly destructure 'slug' to match the route parameter


  return (
    <div>
      <h1>{`Slug: ${slug}`}</h1>
    </div>
  )
}

export default Slug