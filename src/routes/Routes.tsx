import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import OrgAdminLayout from '../layouts/OrgAdminLayout'
import BranchAdminLayout from '../layouts/BranchAdminLayout'
import EmployeeLayout from '../layouts/EmployeeLayout'
import Login from '@/pages/Login'

// We will replace these with the actual layout components
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
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="org-admin">
              <OrgAdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Branch Admin Protected Route */}
        <Route
          path="/branch-admin-dashboard"
          element={
            <ProtectedRoute role="branch-admin">
              <BranchAdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Employee Protected Route */}
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default AppRoutes
