import React from 'react';
import './MembershipPlans.css';

const plans = [
  {
    title: "Basic",
    description: "Access to cardio equipment and basic gym facilities.",
    prices: ["$49 / month", "$129 / quarter", "$229 / 6 months", "$399 / year"],
  },
  {
    title: "Standard",
    description: "Access to cardio equipment, weight room, and steam room.",
    prices: ["$79 / month", "$199 / quarter", "$349 / 6 months", "$599 / year"],
  },
  {
    title: "Premium",
    description: "Access to all gym facilities, including the pool and spa.",
    prices: ["$99 / month", "$249 / quarter", "$449 / 6 months", "$799 / year"],
  },
  
];

const MembershipPlans = () => {
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
            <button>Join Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;
