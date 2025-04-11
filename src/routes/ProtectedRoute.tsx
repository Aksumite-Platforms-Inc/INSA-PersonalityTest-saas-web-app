import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Define the allowed roles
type UserRole = 'org-admin' | 'branch-admin' | 'employee' 

// Props for ProtectedRoute
interface ProtectedRouteProps {
  role?: UserRole
  children: React.ReactElement
}

function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> //show a loading screen during authentication
  }

  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute
