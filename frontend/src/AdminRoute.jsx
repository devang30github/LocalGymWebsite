import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  const AdminToken = localStorage.getItem('AdminToken'); // Check if the token is in localStorage

  return AdminToken ? < Component {...rest} /> : < Navigate to="/adminlogin" />; // Redirect to login if not authenticated
};

export default AdminRoute;

