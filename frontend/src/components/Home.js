// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Census Management </h1>
      <p>Please select your login type:</p>
      <div className="login-buttons">
        <Link to="/officer-login" className="login-button officer">
          Officer Login
        </Link>
        <Link to="/admin-login" className="login-button admin">
          Admin Login
        </Link>
      </div>
    </div>
  );
};

export default Home;