import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../0_Contexts/AuthContext.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from '@components/header/header.jsx'
import TravelD_Home from './assets/TravelD_Home/TravelD_Home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<TravelD_Home />} />
        </Routes>
      </AuthProvider>
    </Router>
      
  
  )
}

export default App
