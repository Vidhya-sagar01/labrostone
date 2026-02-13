import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

// ✅ Client ID Verified
const CLIENT_ID = "556895246164-ctsq8a026fm3u85tcb5boosjmtdb99rg.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
    // ✅ ERROR FIX: React.StrictMode ko hata diya hai taaki ReactQuill 
    // ka 'findDOMNode' issue solve ho jaye.
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
)