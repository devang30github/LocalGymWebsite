import React from 'react';
import './Footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3 className="footer-logo">GymPro Manager</h3>
        <p>Sambhaji Nagar, Ashokvan Dahisar(E)</p>
        <p>Phone: (123) 456-7890</p>
        <p>Email: gympromanager@gmail.com</p>
      </div>
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="./home">Home</a></li>
          <li><a href="./about-us">About</a></li>
          <li><a href="./services">Services</a></li>
          <li><a href="./contactus">Contact</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="#"><FacebookIcon /></a>
          <a href="#"><TwitterIcon /></a>
          <a href="#"><InstagramIcon /></a>
        </div>
      </div>
      <div className="footer-section">
        <p>&copy; 2024 GymPro Manager . All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
