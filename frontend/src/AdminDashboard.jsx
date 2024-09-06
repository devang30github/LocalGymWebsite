import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/registrations');
      const data = await response.json();
      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleSendOtp = async (userId) => {
    try {
      const response = await fetch('http://localhost:3001/admin/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchRegistrations(); // Refresh the registrations list
      } else {
        alert('Error sending OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Pending Registrations</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Membership Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr key={registration._id}>
              <td>{registration.name}</td>
              <td>{registration.email}</td>
              <td>{registration.membershipType ? registration.membershipType.name : 'N/A'}</td>
              <td>
                <button onClick={() => handleSendOtp(registration._id)}>
                  Send OTP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
