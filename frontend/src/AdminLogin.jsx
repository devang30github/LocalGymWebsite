import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from './AdminAuthContext';
import NavBar from './NavBar';
import Footer from './Footer';
//import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdminAuthenticated, AdminLogin} = useContext(AdminAuthContext);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/Admin-Dashboard'); // Redirect to admin dashboard if already logged in as admin
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/admin/login', { email, password });
      AdminLogin(response.data.AdminToken); // Store the token and update authentication state with admin role
      navigate('/Admin-Dashboard'); // Redirect to admin dashboard
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('An error occurred during login.');
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-form-container">
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <label htmlFor="email">Admin Email</label>
            <div className="input-container">
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <label htmlFor="password">Admin Password</label>
            <div className="input-container">
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
