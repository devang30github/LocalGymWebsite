// src/components/GymAmenities.js
import React from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LockIcon from '@mui/icons-material/Lock';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import './GymAmenities.css';

const GymAmenities = () => {
  const amenities = [
    {
      title: 'State-of-the-Art Equipment',
      description: 'Our gym is equipped with the latest and greatest fitness equipment to help you reach your goals.',
      icon: <FitnessCenterIcon style={{ fontSize: 20, color:'white' }} />, // Replace with actual icon paths
    },
    {
      title: 'Luxury Locker Rooms',
      description: 'Enjoy our spacious and well-appointed locker rooms with showers, saunas, and more.',
      icon: <LockIcon style={{ fontSize: 20, color:'white' }} />, // Replace with actual icon paths
    },
    {
      title: 'Nutrition Counseling',
      description: 'Our team of registered dietitians are here to help you develop a personalized nutrition plan.',
      icon: <RestaurantIcon style={{ fontSize: 20,color:'white'}} />, // Replace with actual icon paths
    },
  ];

  return (
    <section className="gym-amenities">
      <h2>Gym Amenities</h2>
      <p>Discover the top-notch facilities and services we offer.</p>
      <div className="amenities-container">
        {amenities.map((amenity, index) => (
          <div className="amenity-card" key={index}>
            <h3>{amenity.icon}{amenity.title}</h3>
            <p>{amenity.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GymAmenities;
