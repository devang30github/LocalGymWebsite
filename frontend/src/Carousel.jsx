import React, { useState , useEffect} from 'react';
import './Carousel.css';

const images = [
  '/heroSection.jpg',
  '/gympic1.jpg',
  '/gympic2.jpg',
  '/gympic3.jpg',
  // Add more image paths as needed
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel">
      <h1>Take a Tour of Our Gym</h1>
      <p>Get a glimpse of our state-of-the-art facilities and see why Fitness Gym is the premier choice for your fitness journey.</p>
      <div className="carousel-container">
        <button className="carousel-button left" onClick={prevSlide}>&lt;</button>
        <div className="carousel-slide">
          <img src={images[currentIndex]} alt={`Slide ${currentIndex}`}
className="carousel-image" />
        </div>
        <button className="carousel-button right" onClick={nextSlide}>&gt;</button>
      </div>
    </div>
  );
};

export default Carousel;
