import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from '@components/header/header.jsx' // Importing Header component from shared components directory
import Home from './pages/Home/Home.jsx' // Importing Home component from local pages directory
import Page404 from './pages/404 page/404NotFound.jsx' // Importing 404 Not Found component from local pages directory

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  )
}

export default App
