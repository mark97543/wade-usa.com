import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../../packages/ui/src/styles/variables.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
