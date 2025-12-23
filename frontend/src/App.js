// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout
import Layout from './components/Layout'; 

// Import Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Import Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import Private User Pages
import SearchPage from './pages/SearchPage';
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';
import CabinetPage from './pages/CabinetPage';

// Import Private Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageMedicines from './pages/admin/ManageMedicines';

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Routes that use the Navbar Layout --- */}
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        
        {/* --- Private User Routes --- */}
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/report/:id" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/cabinet" element={<PrivateRoute><CabinetPage /></PrivateRoute>} />
        
        {/* --- Private Admin Routes --- */}
        <Route 
          path="/admin/dashboard" 
          element={<AdminRoute><AdminDashboard /></AdminRoute>} 
        />
        <Route 
          path="/admin/users" 
          element={<AdminRoute><ManageUsers /></AdminRoute>} 
        />
        <Route 
          path="/admin/medicines" 
          element={<AdminRoute><ManageMedicines /></AdminRoute>} 
        />
      </Route>
    </Routes>
  );
}

export default App;