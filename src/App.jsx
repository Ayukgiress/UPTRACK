import React from 'react'
import './App.css'
import './Pages/HomePage/Home'
import Home from './Pages/HomePage/Home'
import Login from './Pages/AuthPage/Login'
import './Pages/AuthPage/Registrations'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Registrations from './Pages/AuthPage/Registrations'
import { AuthProvider } from './Pages/AuthContext'
import VerifyEmail from './Components/VerifyEmail'
import VerifyEmails from './Components/VerifyEmails'
import Dashboard from './Pages/Dashboard'


function App() {

  return (
   < AuthProvider>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrations />} />
          <Route path="/verify-email" element={<VerifyEmails />} />
          // <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* <Route path="/:contestId/vote" element={<Vote />} /> */}
          <Route path="/dashboard" element={<Dashboard />}>
            {/* <Route index element={<Overview />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </Router>
      </AuthProvider>
    
  )
}

export default App
