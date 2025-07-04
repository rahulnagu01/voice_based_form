// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
  const officerInfo = JSON.parse(localStorage.getItem('officerInfo'));

  const handleLogout = () => {
    if (adminInfo) {
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('adminToken');
    }
    if (officerInfo) {
      localStorage.removeItem('officerInfo');
      localStorage.removeItem('officerToken');
    }
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Census Management</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/person-details">Person Details</Link></li>
          {!adminInfo && !officerInfo && (
            <>
              <li><Link to="/officer-login">Officer Login</Link></li>
              <li><Link to="/admin-login">Admin Login</Link></li>
            </>
          )}
          {(adminInfo || officerInfo) && (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;