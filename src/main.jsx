import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initWebVitals } from './utils/reportWebVitals'
import { registerServiceWorker } from './registerServiceWorker'

// Initialize Core Web Vitals telemetry & Offline PWA Service Worker
initWebVitals()
registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
