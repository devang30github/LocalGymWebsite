import React from 'react';
import './RegisterForm.css';

const RegisterForm = () => {
  return (
    <div className="registration-container">
      <form className="registration-form">
      <h1>Join Our Gym</h1>
        <p>Follow these steps to complete your registration:</p>
        <ol>
          <li>Fill out the form below</li>
          <li>Select your membership plan</li>
          <li>Complete the payment process</li>
        </ol>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" required />
    
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter a password" required />

        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />

        <label htmlFor="membership">Membership Plan</label>
        <select id="membership" name="membership" required>
          <option value="">Select a plan</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="family">Family</option>
        </select>

        <div className="terms">
          <input type="checkbox" id="terms" name="terms" required />
          <label htmlFor="terms">I agree to the <a href="/terms">terms and conditions</a></label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
