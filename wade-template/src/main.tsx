// /root/projects/wade-template/src/main.tsx

/**
 * Application Entry Point
 * -----------------------
 * This is where React actually attaches to the HTML web page (DOM).
 * * Crucial Job:
 * It wraps the entire <App /> inside our Global Providers (like AuthProvider).
 * This ensures that "Power" (Context) flows to every single component in the tree.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Providers } from './context/Provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
