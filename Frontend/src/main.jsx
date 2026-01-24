import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './Context/AuthContext.jsx'
import UserContext from './Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  //this BrowserRouter will help to navigate between different pages
  // {/* //AuthContext provide the server url to all the children components like app.jsx here */}
  //AuthContext provide the server url to all the children components like app.jsx here 
  //UserContext provide the user data to all the children components like app.jsx here */}
  <BrowserRouter>
  <AuthContext>
    <UserContext>
    <App />
    </UserContext>
  </AuthContext>
  </BrowserRouter>
)
