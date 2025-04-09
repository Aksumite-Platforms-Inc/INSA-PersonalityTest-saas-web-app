import React from 'react'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/Routes'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
