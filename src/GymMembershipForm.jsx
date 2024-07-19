// GymMembershipForm.js
import React, { useState } from 'react';
import './GymMembershipForm.css';

const GymMembershipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipType: 'Basic',
    termsAgreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="form-container">
      <h2>Gym Membership Registration</h2>
      <p>Fill out the form below to register for your gym membership.</p>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Membership Type</label>
        <select
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
        >
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
          />
          I agree to the terms and conditions
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default GymMembershipForm;
