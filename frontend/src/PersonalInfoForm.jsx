import React from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './GymMembershipForm.css';

const PersonalInfoForm = ({ formData, handleChange, showPassword, handleClickShowPassword }) => {
  return (
    <>
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
    </>
  );
};

export default PersonalInfoForm;
