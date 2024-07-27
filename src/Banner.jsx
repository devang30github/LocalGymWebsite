import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  const navigate = useNavigate();

  const handleJoinNowClick = () => {
    navigate('/registration');
  };
  return (
    <header className="banner">
      <div className="overlay">
        <h1>Strong Mind, Strong Body</h1>
        <h3>Welcome to the new world </h3>
        <p>Experience the best gym in town with state-of-the-art equipment and expert trainers.</p>
        <button className="join-now" onClick={handleJoinNowClick}>Join Now</button>
      </div>
    </header>
  );
};

export default Banner;