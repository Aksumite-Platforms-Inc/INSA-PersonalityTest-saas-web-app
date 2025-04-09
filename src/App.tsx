/* eslint-disable react/react-in-jsx-scope */
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<div>Admin Dashboard</div>} />
        <Route
          path="/branch-admin-dashboard"
          element={<div>Branch Admin Dashboard</div>}
        />
        <Route
          path="/employee-dashboard"
          element={<div>Employee Dashboard</div>}
        />
      </Routes>
    </Router>
  )
}

export default App
