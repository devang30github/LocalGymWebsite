import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TrainingPlans.css';

const plans = [
  {
    title: "Beginner",
    description: "Personalized workout plans and basic training sessions.",
    prices: ["₹1500 / month", "₹8000 / 6 months", "₹15,000 / year"],
  },
  {
    title: "Intermediate",
    description: "Customized training plans with dietary guidance.",
    prices: ["₹1800 / month", "₹9,500 / 6 months", "₹18,000 / year"],
  },
  {
    title: "Advanced",
    description: "Comprehensive personal training with advanced techniques and nutrition support.",
    prices: ["₹2000 / month", "₹10,500 / 6 months", "₹20,000 / year"],
  },
];

const TrainingPlans = () => {
  const navigate = useNavigate();

  const handleJoinNowClick = () => {
    navigate('/registration');
  };
  return (
    <div className="training-plans-section">
      <h1>Personal Training Plans</h1>
      <p>Take your fitness to the next level with our personalized training plans.</p>
      <div className="plans-container">
        {plans.map((plan, index) => (
          <div className="plan-card" key={index}>
            <h2>{plan.title}</h2>
            <p>{plan.description}</p>
            <div className="prices">
              {plan.prices.map((price, idx) => (
                <p key={idx}>{price}</p>
              ))}
            </div>
            <button onClick={handleJoinNowClick}>Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPlans;
