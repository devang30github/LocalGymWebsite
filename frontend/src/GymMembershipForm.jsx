import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GymMembershipForm.css';

const GymMembershipForm = () => {
  const qrCodeUrls = {
    'Personal-Training-Beginner-1': '/qrcode_5rs.jpeg',
    'Personal-Training-Beginner-2': '/qrcode_5rs.jpeg',
    'Personal-Training-Beginner-3': '/qrcode_5rs.jpeg',
    'Personal-Training-Intermediate-1': '/qrcode_5rs.jpeg',
    'Personal-Training-Intermediate-2': '/qrcode_5rs.jpeg',
    'Personal-Training-Intermediate-3': '/qrcode_5rs.jpeg',
    'Personal-Training-Advanced-1': '/qrcode_5rs.jpeg',
    'Personal-Training-Advanced-2': '/qrcode_5rs.jpeg',
    'Personal-Training-Advanced-3': '/qrcode_5rs.jpeg',
    'membership_plan_basic-1': '/qrcode_basic_1month.jpeg',
    'membership_plan_basic-2': '/qrcode_basic_6month.jpeg',
    'membership_plan_basic-3': '/qrcode_basic_12month.jpeg',
    'membership_plan_standard-1': '/qrcode_standard_1month.jpeg',
    'membership_plan_standard-2': '/qrcode_standard_6month.jpeg',
    'membership_plan_standard-3': '/qrcode_standard_12month.jpeg',
    'membership_plan_premium-1': '/qrcode_premium_1month.jpeg',
    'membership_plan_premium-2': '/qrcode_premium_6month.jpeg',
    'membership_plan_premium-3': '/qrcode_5rs.jpeg',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipType: 'membership_plan_basic-1',
    termsAgreed: false,
  });
  const [memberships, setMemberships] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [formHeight, setFormHeight] = useState('650px'); // Initial height
  const [qrCodeUrl, setQrCodeUrl] = useState(qrCodeUrls['membership_plan_basic-1']); // Initial QR code
  const navigate = useNavigate();

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

  useEffect(() => {
    if (registrationSuccess) {
      localStorage.setItem(
        'registrationState',
        JSON.stringify({ userId, registrationSuccess })
      );
    }
  }, [registrationSuccess, userId]);

  useEffect(() => {
    // Fetch memberships from the server when the component mounts
    const fetchMemberships = async () => {
      try {
        const response = await axios.get('http://localhost:3001/memberships'); // Make sure this endpoint matches your server route
        setMemberships(response.data);
        // Set the initial membership type if data is available
        if (response.data.length > 0) {
          setFormData(prevState => ({ ...prevState, membershipType: response.data[0]._id }));
          setQrCodeUrl('/qrcode_5rs.jpeg'); // Set default QR code URL
        }
      } catch (error) {
        console.error('Error fetching memberships:', error);
      }
    };

    fetchMemberships();
  }, []);


  const resetRegistrationState = () => {
    localStorage.clear();
    setUserId(null);
    setRegistrationSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Update the QR code URL when the membership type changes
  if (name === 'membershipType') {
    const selectedMembership = memberships.find(membership => membership._id === value);

    if (selectedMembership) {
      // Remove any text in parentheses and trim whitespace
      const cleanName = selectedMembership.name.replace(/\s*\(.*?\)\s*/g, '').trim();
      
      // Construct the key for QR code URL based on the cleaned name
      const membershipKey = `${cleanName.replace(/ /g, '-')}-${selectedMembership.durationInMonths}`;
      const qrCodeUrl = qrCodeUrls[cleanName];

      setQrCodeUrl(qrCodeUrl || qrCodeUrls['membership_plan_basic-1']); // Default to a fallback QR code
    }
  }
};

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePassword = (password) =>
    password.length >= 8 && // Minimum length
    /[A-Z]/.test(password) && // At least one uppercase letter
    /[0-9]/.test(password) && // At least one digit
    /[!@#$%^&*]/.test(password); // At least one special character

  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateName(formData.name)) {
      alert('Name should only contain letters and spaces.');
      return;
    }

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      alert('Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }
  
      const data = await response.json();
      setUserId(data.userId);
      setRegistrationSuccess(true);
      setFormHeight('1250px');
    } catch (error) {
      console.error('Error:', error);
      alert(`Registration failed: ${error.message}`);
    }
  };
  

  const handlePaymentConfirmation = async () => {
    try {
      const response = await fetch('http://localhost:3001/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp ,membershipTypeId: formData.membershipType,}), // Include OTP in the request
      });

      const data = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        localStorage.removeItem('registrationState');
        alert(data.message);
        navigate('/login');
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
    <div className="registration">
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
          required
        >
          {memberships.map((membership) => (
            <option key={membership._id} value={membership._id}>
              {membership.name} ({membership.durationInMonths}-month)
            </option>
          ))}
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
        <img src={qrCodeUrl} alt="QR Code" className="qr-code"/>  {/* Display the dynamic QR code */}
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
    </div>
  );
};

export default GymMembershipForm;
