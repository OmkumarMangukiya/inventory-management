import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Extend the Window interface to include ipcRenderer
declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (event: Event, ...args: unknown[]) => void) => void;
      send: (channel: string, ...args: unknown[]) => void;
    };
  }
}

// Disable the menu bar
window.ipcRenderer.send('disable-menu-bar');

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
