import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// We will replace these with the actual layout components
const OrgAdminLayout = () => <div>Org Admin Dashboard</div>
const BranchAdminLayout = () => <div>Branch Admin Dashboard</div>
const EmployeeLayout = () => <div>Employee Dashboard</div>
const SuperadminLayout = () => <div>Superadmin Control Panel</div>
const Login = () => <div>Login Page</div>
const NotFound = () => <div>404 - Page Not Found</div>

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />

        {/* Org Admin Protected Route */}
        <Route
          path="/org-admin"
          element={
            <ProtectedRoute role="org-admin">
              <OrgAdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Branch Admin Protected Route */}
        <Route
          path="/branch-admin"
          element={
            <ProtectedRoute role="branch-admin">
              <BranchAdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Employee Protected Route */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeLayout />
            </ProtectedRoute>
          }
        />

        {/* Superadmin Protected Route */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute role="superadmin">
              <SuperadminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default AppRoutes
