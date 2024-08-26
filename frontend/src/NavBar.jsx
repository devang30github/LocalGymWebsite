// src/Navbar.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAboutClick = () => {
    navigate('/about-us');
  };

  const handleServicesClick = () => {
    navigate('/services');
  };

  const handleContactClick = () => {
    navigate('/Contact-us');
  };

  const handleWorkoutClick = () => {
    navigate('/Workout-generator');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/gym.png" alt="Gym Logo" className="logo" />
        <h1>SIDDHIVINAYAK GYM</h1>
      </div>
      <ul className="navbar-links">
        <li><button onClick={handleHomeClick}>Home</button></li>
        <li><button onClick={handleAboutClick}>About Us</button></li>
        <li><button onClick={handleServicesClick}>Services</button></li>
        <li><button onClick={handleContactClick}>Contact Us</button></li>
        <li><button onClick={handleWorkoutClick}>Workout Generator</button></li>
      </ul>
      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="menu">
            <button className="menu-button">R</button>
            <div className="dropdown">
              <button onClick={handleDashboard}>Dashboard</button>
              <button>Profile</button>
              <button onClick={handleLogout}>LogOut</button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
