// src/routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';  // Make sure this import is correct
import Contact from './components/Contact';
import PersonDetails from './components/PersonDetails';
import OfficerLogin from './components/OfficerLogin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

const AppRoutes = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/person-details" element={<PersonDetails />} />
          <Route path="/officer-login" element={<OfficerLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          <Route 
            path="/admin-dashboard/*" 
            element={
              <ProtectedRoute type="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/officer-dashboard/*" 
            element={
              <ProtectedRoute type="officer">
                <OfficerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRoutes;