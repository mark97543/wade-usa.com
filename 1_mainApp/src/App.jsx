import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../0_Contexts/AuthContext.jsx'
import ProtectedRoute from '../../0_Contexts/ProtectedRoute.jsx'
import './App.css'
import Header from '@components/header/header.jsx' // Importing Header component from shared components directory
import Home from './pages/Home/Home.jsx' // Importing Home component from local pages directory
import Page404 from './pages/404 page/404NotFound.jsx' // Importing 404 Not Found component from local pages directory
import Login from './pages/Login/Login.jsx' // Importing Login component from local pages directory
import Docker from './pages/Dock/Docker.jsx'
import Forbbiden from './pages/forbidden/Forbbiden.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/forbidden' element={<Forbbiden />} />

          {/* Protected Routes  */}
          <Route element={<ProtectedRoute/>}>
            <Route path='/docker' element={<Docker />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
