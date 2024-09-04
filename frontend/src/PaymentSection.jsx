import React from 'react';
import './GymMembershipForm.css';

const PaymentSection = ({ qrCodeUrl, otp, setOtp, handlePaymentConfirmation }) => {
  return (
    <div className="payment-section">
      <h3>Complete Your Payment</h3>
      <img
        className="qr-code"
        src={qrCodeUrl} // Ensure qrCodeUrl is a valid image URL or path
        alt="QR Code for Payment"
        width={200}
        height={200}
      />
      <p>Scan the QR code to make the payment and enter the OTP you received.</p>

      <label htmlFor="otp">Enter OTP</label>
      <input
        id="otp" // Added id for better accessibility
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)} // Ensure setOtp is updating state correctly
      />
      <button className='btn' onClick={handlePaymentConfirmation}>Confirm Payment</button>
    </div>
  );
};

export default PaymentSection;
