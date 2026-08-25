import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import Departments from './pages/admin/Departments'
import Employees from './pages/admin/Employees'
import Attendance from './pages/admin/Attendance'
import LeaveRequests from './pages/admin/LeaveRequests'
import MyAttendance from './pages/employee/MyAttendance'
import MyLeaves from './pages/employee/MyLeaves'

function Shell({ children, staffOnly }) {
  return (
    <ProtectedRoute staffOnly={staffOnly}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

function RootRedirect() {
  const { user, isStaff } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={isStaff ? '/dashboard' : '/my-attendance'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          <Route path="/dashboard" element={<Shell staffOnly><Dashboard /></Shell>} />
          <Route path="/departments" element={<Shell staffOnly><Departments /></Shell>} />
          <Route path="/employees" element={<Shell staffOnly><Employees /></Shell>} />
          <Route path="/attendance" element={<Shell staffOnly><Attendance /></Shell>} />
          <Route path="/leave-requests" element={<Shell staffOnly><LeaveRequests /></Shell>} />

          <Route path="/my-attendance" element={<Shell><MyAttendance /></Shell>} />
          <Route path="/my-leaves" element={<Shell><MyLeaves /></Shell>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
