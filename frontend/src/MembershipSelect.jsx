import React, { useState, useEffect } from 'react';
import './GymMembershipForm.css';

const MembershipSelect = ({ formData, handleChange }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:3001/memberships');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        // Optionally, add user feedback here
      }
    };

    fetchPlans();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <label htmlFor="membership">Membership Type</label>
      <select
        id="membership"
        name="membership"
        value={formData.membership || ''} // Ensure default value is empty if not set
        onChange={handleChange}
      >
        {plans.length > 0 ? (
          plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name} ({plan.durationInMonths} month)
            </option>
          ))
        ) : (
          <option disabled>Loading options...</option>
        )}
      </select>
    </>
  );
};

export default MembershipSelect;
