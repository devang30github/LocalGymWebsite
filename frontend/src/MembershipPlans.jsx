import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MembershipPlans.css';


const plans = [
  {
    title: "Basic",
    description: "Access to basic gym facilities.",
    prices: ["₹800 / month",  "₹3600 / 6 months", "₹6000 / year"],
  },
  {
    title: "Standard",
    description: "Access to cardio equipment and weight room",
    prices: ["₹1000 / month",  "₹4800 / 6 months", "₹7200 / year"],
  },
  {
    title: "Premium",
    description: "Access to all gym facilities, including the steam room and spa.",
    prices: ["₹1200 / month", "₹5400 / 6 months", "₹9600 / year"],
  },
  
];

const MembershipPlans = () => {
  const navigate = useNavigate();

  const handleJoinNowClick = () => {
    navigate('/registration');
  };
  return (
    <div className="membership-plans-section">
      <h1>Membership Plans</h1>
      <p>Unlock access to our state-of-the-art gym facilities with our membership plans.</p>
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
            
            <button onClick={handleJoinNowClick}>Join Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;
