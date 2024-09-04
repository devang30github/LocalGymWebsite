import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import NavBar from './NavBar';
import Footer from './Footer';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      login(response.data.token); // Store the token and update authentication state
      navigate('/'); // Redirect to home page
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
    <NavBar/>
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <label htmlFor="email">Email</label>
        <div className="input-container">
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <label htmlFor="password">Password</label>
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
    <Footer/>
    </>
  );
};

export default Login;
