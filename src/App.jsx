import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Join from './pages/Join.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'

function isAuthed() {
  return !!localStorage.getItem('gc_access')
}

function Private({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/join" element={<Join />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
    </Routes>
  )
}
