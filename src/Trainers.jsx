import React from 'react';
import './Trainers.css';

const trainers = [
  {
    name: 'John Doe',
    title: 'Personal Trainer',
    description: 'John is a certified personal trainer with over 10 years of experience. He specializes in strength training and helping clients achieve their fitness goals.',
    image: '/trainer2.jpg', // Replace with actual image paths
  },
  {
    name: 'Jane Smith',
    title: 'Yoga Instructor',
    description: 'Jane is a certified yoga instructor with a passion for helping people improve their flexibility and mindfulness. She teaches a variety of yoga styles to suit all levels.',
    image: '/trainer3.png', // Replace with actual image paths
  },
  {
    name: 'Michael Johnson',
    title: 'Strength and Conditioning Coach',
    description: 'Michael is a certified strength and conditioning coach with a focus on helping athletes and fitness enthusiasts improve their overall performance and prevent injuries.',
    image: '/trainer2.jpg', // Replace with actual image paths
  },
];

const Trainers = () => {
  return (
    <div className="trainers-section">
      <h2>Meet Our Trainers</h2>
      <p>Our team of experienced trainers are dedicated to helping you achieve your fitness goals.</p>
      <div className="trainers-container">
        {trainers.map((trainer, index) => (
          <div key={index} className="trainer-card">
            <div className="trainer-image" style={{ backgroundImage: `url(${trainer.image})` }}></div>
            <div className="trainer-info">
              <h3>{trainer.name}</h3>
              <h4>{trainer.title}</h4>
              <p>{trainer.description}</p>
              <p>hello</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trainers;
