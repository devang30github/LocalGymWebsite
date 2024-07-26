// GymMembershipForm.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './GymMembershipForm.css';

const GymMembershipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipType: 'Basic',
    termsAgreed: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'email' ? value.toLowerCase() : (type === 'checkbox' ? checked : value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          className='lwcase'
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="password-input"
          />
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            className="password-icon"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>

        <label>Membership Type</label>
        <select
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
        >
          <optgroup label="Personal Training">
            <option value="personal_training_beginner">PT-Beginner</option>
            <option value="personal_training_intermediate">PT-Intermediate</option>
            <option value="personal_training_advanced">PT-Advanced</option>
          </optgroup>
          <optgroup label="Membership Plans">
            <option value="membership_plan_basic">M-Basic</option>
            <option value="membership_plan_standard">M-Standard</option>
            <option value="membership_plan_premium">M-Premium</option>
          </optgroup>
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

        <button type="submit" className='btn'>Register</button>
      </form>
    </div>
  );
};

export default GymMembershipForm;
