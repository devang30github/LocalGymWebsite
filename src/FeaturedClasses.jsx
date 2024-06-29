// src/components/FeaturedClasses.js
import React from 'react';
import './FeaturedClasses.css';

const FeaturedClasses = () => {
  const classes = [
    {
      title: 'CroosFit',
      description: 'Improve your flexibility, strength, and mindfulness with our yoga classes.',
      image: 'crossfit.jpg', // Replace with actual image paths
    },
    {
      title: 'Personalized Workouts',
      description: 'Get your heart pumping with our high-intensity spin classes.',
      image: '/dumbellBG.jpg', // Replace with actual image paths
    },
    {
      title: 'Strength Training',
      description: 'Build muscle and improve your overall strength with our strength training classes.',
      image: '/strengthBG.jpg', // Replace with actual image paths
    },
  ];

  return (
    <section className="featured-classes">
      <h2>Featured Classes</h2>
      <p>Explore our wide range of fitness classes to find the perfect workout for you.</p>
      <div className="classes-container">
        {classes.map((classItem, index) => (
          <div className="class-card" key={index}>
            <div className="class-image" style={{ backgroundImage: `url(${classItem.image})` }}></div>
            <h3>{classItem.title}</h3>
            <p>{classItem.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedClasses;
