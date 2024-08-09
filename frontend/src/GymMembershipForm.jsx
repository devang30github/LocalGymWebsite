import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './GymMembershipForm.css';

const GymMembershipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipType: 'membership_plan_basic-1',
    termsAgreed: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
 
  
  useEffect(() => {
    const savedState = localStorage.getItem('registrationState');
    if (savedState) {
      const { userId, registrationSuccess } = JSON.parse(savedState);
      setUserId(userId);
      setRegistrationSuccess(registrationSuccess);
      if (registrationSuccess) {
        setFormHeight('1250px');
      } else {
        setFormHeight('750px');
      }
    }
  }, []);

  const [formHeight, setFormHeight] = useState('650px'); // Initial height

  const resetRegistrationState = () => {
    // Clear localStorage entirely
    localStorage.clear();

    // Clear component state
    setUserId(null);
    setRegistrationSuccess(false);
  };

  useEffect(() => {
    if (registrationSuccess) {
      localStorage.setItem(
        'registrationState',
        JSON.stringify({ userId, registrationSuccess })
      );
    }
  }, [registrationSuccess, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setUserId(data.userId);
      setRegistrationSuccess(true);
      setFormHeight('1250px');
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed');
    }
  };

  const handlePaymentConfirmation = async () => {
    try {
      const response = await fetch('http://localhost:3001/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, otp }) // Include OTP in the request
      });

      const data = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        localStorage.removeItem('registrationState');
        alert(data.message);
      } else {
        alert('Payment confirmation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('An error occurred during payment confirmation.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container" style={{ height: formHeight }}>
      <h2>Gym Membership Registration</h2>
      <p>Fill out the form below to register for your gym membership.</p>
      <form onSubmit={handleRegister}>
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
          className="lwcase"
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
            <option value="personal_training_beginner-1">PT-Beginner(1-month)</option>
            <option value="personal_training_beginner-2">PT-Beginner(6-month)</option>
            <option value="personal_training_beginner-3">PT-Beginner(12-month)</option>
            <option value="personal_training_intermediate-1">PT-Intermediate(1-month)</option>
            <option value="personal_training_intermediate-2">PT-Intermediate(6-month)</option>
            <option value="personal_training_intermediate-3">PT-Intermediate(12-month)</option>
            <option value="personal_training_advanced-1">PT-Advanced(1-month)</option>
            <option value="personal_training_advanced-2">PT-Advanced(6-month)</option>
            <option value="personal_training_advanced-3">PT-Advanced(12-month)</option>
          </optgroup>
          <optgroup label="Membership Plans">
            <option value="membership_plan_basic-1">M-Basic(1-month)</option>
            <option value="membership_plan_basic-2">M-Basic(6-month)</option>
            <option value="membership_plan_basic-3">M-Basic(12-month)</option>
            <option value="membership_plan_standard-1">M-Standard(1-month)</option>
            <option value="membership_plan_standard-2">M-Standard(6-month)</option>
            <option value="membership_plan_standard-3">M-Standard(12-month)</option>
            <option value="membership_plan_premium-1">M-Premium(1-month)</option>
            <option value="membership_plan_premium-2">M-Premium(6-month)</option>
            <option value="membership_plan_premium-3">M-Premium(12-month)</option>
          </optgroup>

        </select>

        <label>
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
            required
          />
          I agree to the terms and conditions
        </label>

        <button type="submit" className='btn'>Register</button>
        <button onClick={resetRegistrationState} >Retry</button>
        
      </form>
      {registrationSuccess && (
      <div className="payment-section">
        <h3>Scan the QR Code to Make Payment</h3>
        <img src="/qrcode_5rs.jpeg" alt="QR Code" className="qr-code"/>
        <p>After payment, enter the OTP sent to your email:</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className='otp-input'
          required
        />
        <button onClick={handlePaymentConfirmation} className="btn">Confirm Payment</button>
      </div>
    )}

    {otpVerified && <p className="confirmation-message">Payment confirmed and registration completed!</p>}
    </div>
  );
};

export default GymMembershipForm;
