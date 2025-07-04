// src/components/layouts/AdminLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin-login');
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <h1>Census Management</h1>
          </div>
          <div className="admin-profile">
            <span className="admin-name">Admin: {adminInfo.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {children}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="admin-footer">
        <div className="admin-footer-content">
          <p>© 2024 Census Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;