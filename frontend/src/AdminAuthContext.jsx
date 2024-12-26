import React, { createContext, useState, useEffect } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('AdminToken');
    if (token) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const AdminLogin = (token) => {
    localStorage.setItem('AdminToken', token);
    setIsAdminAuthenticated(true);
  };

  const AdminLogout = () => {
    localStorage.removeItem('AdminToken');
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated,AdminLogin, AdminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};