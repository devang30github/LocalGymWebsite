import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TrainingPlans.css';

const plans = [
  {
    title: "Beginner",
    description: "Get started on your fitness journey with our beginner plan.",
    prices: ["$99 / month", "$249 / quarter", "$449 / 6 months", "$799 / year"],
  },
  {
    title: "Intermediate",
    description: "Take your fitness to the next level with our intermediate plan.",
    prices: ["$149 / month", "$399 / quarter", "$699 / 6 months", "$1,199 / year"],
  },
  {
    title: "Advanced",
    description: "Reach your fitness goals with our advanced plan.",
    prices: ["$199 / month", "$549 / quarter", "$999 / 6 months", "$1,799 / year"],
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
