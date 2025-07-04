// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, type = "officer" }) => {
  const adminToken = localStorage.getItem('adminToken');
  const officerToken = localStorage.getItem('officerToken');

  if (type === "admin") {
    if (!adminToken) {
      return <Navigate to="/admin-login" />;
    }
  } else if (type === "officer") {
    if (!officerToken) {
      return <Navigate to="/officer-login" />;
    }
  }

  return children;
};

export default ProtectedRoute;