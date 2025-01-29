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
import OauthCallback from './Components/OauthCallback'
import { Toaster } from 'sonner'
import Pending from './Pages/DashboardOutlets/Pending'
import Completed from './Pages/DashboardOutlets/Completed'
import Overview from './Pages/DashboardOutlets/Overview'
import Settings from './Pages/DashboardOutlets/Settings'
import TodoDetail from './Pages/TodoDetail'


function App() {

  return (
   < AuthProvider>
         <Toaster richColors />

    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrations />} />
          <Route path="/verify-email" element={<VerifyEmails />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/oauth-callback" element={<OauthCallback />} />
          <Route path="/supervisor/todos/:id" element={<TodoDetail />} />
             <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="pending" element={<Pending />} />
            <Route path="completed" element={<Completed />} />

          </Route>
        </Routes>
      </Router>
      </AuthProvider>
    
  )
}

export default App
