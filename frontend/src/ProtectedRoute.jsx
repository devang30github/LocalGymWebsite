import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Check if the token is in localStorage

  return token ? <Component {...rest} /> : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
