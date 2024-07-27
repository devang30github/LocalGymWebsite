import React from 'react';
import './Footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3 className="footer-logo">Siddhivinayak Gym</h3>
        <p>Sambhaji Nagar, Ashokvan Dahisar(E)</p>
        <p>Phone: (123) 456-7890</p>
        <p>Email: siddhivinayakgym@gmail.com</p>
      </div>
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Classes</a></li>
          <li><a href="#">Trainers</a></li>
          <li><a href="#">Contact</a></li>
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
        <p>&copy; 2024 Siddhivinayak  Gym. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
