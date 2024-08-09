import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FitnessCarousel.css';

const FitnessCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <div className="carousel-content">
          <h1>Welcome to Fitness Gym</h1>
          <p>
            Discover a world-class fitness experience at our state-of-the-art gym.
            Explore our cutting-edge equipment, expert trainers, and vibrant community.
          </p>
          <div className="carousel-buttons">
            <Button variant="primary">Join Now</Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-content">
          <div className="empty-image"></div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default FitnessCarousel;
