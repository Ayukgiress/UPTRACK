import React from 'react'
import './App.css'
import './Pages/HomePage/Home'
import Home from './Pages/HomePage/Home'
import Login from './Pages/AuthPage/Login'
import { useAuth } from './Pages/AuthContext'
import './Pages/AuthPage/Registrations'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import Registrations from './Pages/AuthPage/Registrations'
import { AuthProvider } from './Pages/AuthContext'
import { ThemeProvider } from './Components/ThemeContext'
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
import Charts from './Pages/DashboardOutlets/Charts'
import Supervisor from './Pages/DashboardOutlets/Supervisor'
import Projects from './Pages/DashboardOutlets/Projects'
import PasswordReset from './Pages/Password/ResetToken'
import PasswordResetRequest from './Pages/Password/ResetPassword'
import AcceptInvitation from './Pages/AcceptInvitation'
import FloatingChatIcon from './Components/FloatingChatIcon'
import Narbar from './Components/Narbar'

function ConditionalNarbar() {
  const location = useLocation();
  return location.pathname === '/' ? <Narbar /> : null;
}


function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
        <ConditionalNarbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrations />} />
          <Route path="/verify-email" element={<VerifyEmails />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/oauth-callback" element={<OauthCallback />} />
          <Route path="/supervisor/todos/:id" element={<Navigate to={isAuthenticated ? "/dashboard/supervisor" : "/login"} replace />} />
          <Route path="/reset-password/:token" element={<PasswordReset />} />
          <Route path="/password" element={<PasswordResetRequest/>} />
          <Route path="/projects/:projectId/accept-invitation" element={<AcceptInvitation />} />
             <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="pending" element={<Pending />} />
            <Route path="completed" element={<Completed />} />
            <Route path="supervisor" element={<Supervisor />} />
            <Route path="projects" element={<Projects />} />
             <Route path="charts" element={<Charts />} />

          </Route>
        </Routes>
        <FloatingChatIcon />
      </Router>
  );
}

function App() {
  React.useEffect(() => {
    document.title = "UPTRACK - Task Management Dashboard"; // Set project title in browser tab
  }, []);

  return (
   <ThemeProvider>
     <AuthProvider>
         <Toaster richColors />
         <AppContent />
      </AuthProvider>
   </ThemeProvider>

  )
}

export default App
