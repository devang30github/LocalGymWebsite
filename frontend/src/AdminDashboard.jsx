import React, { useState, useEffect,useContext  } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { AdminAuthContext } from './AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdminAuthenticated, AdminLogout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(null); // To track which OTP is being sent
  const [deletingRequest, setDeletingRequest] = useState(null); // To track which request is being deleted

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleLogout = () => {
    AdminLogout();
    navigate('/adminlogin');
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('AdminToken')}` // Ensure the token is sent with the request
        }
      });
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      setError('Error fetching registrations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (userId) => {
    try {
      setSendingOtp(userId); // Track which OTP is being sent to show a loading state
      const response = await fetch('http://localhost:3001/admin/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('AdminToken')}` // Ensure the token is sent with the request
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchRegistrations(); // Refresh the registrations list
      } else {
        alert('Error sending OTP: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP');
    } finally {
      setSendingOtp(null); // Reset loading state after sending OTP
    }
  };

  const handleDeleteRequest = async (userId) => {
    try {
      setDeletingRequest(userId); // Track which request is being deleted to show a loading state
      const response = await fetch(`http://localhost:3001/admin/delete-request/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('AdminToken')}` // Ensure the token is sent with the request
        }
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchRegistrations(); // Refresh the registrations list
      } else {
        alert('Error deleting request: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request');
    } finally {
      setDeletingRequest(null); // Reset loading state after deleting request
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <NavBar/>
    <div>
      <h1>Admin Dashboard</h1>
      <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#3498DB',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            cursor: 'pointer',
            borderRadius: '5px',
            marginBottom: '20px'
          }}
        >
          Logout
        </button>
      <h2>Pending Registrations</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if any */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <button
                  onClick={() => handleSendOtp(registration._id)}
                  disabled={sendingOtp === registration._id} // Disable button while OTP is being sent
                  style={{
                    backgroundColor: sendingOtp === registration._id ? '#ddd' : '#00BFA6',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: sendingOtp === registration._id ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                    marginRight: '10px'
                  }}
                >
                  {sendingOtp === registration._id ? 'Sending...' : 'Send OTP'}
                </button>
                <button
                  onClick={() => handleDeleteRequest(registration._id)}
                  disabled={deletingRequest === registration._id} // Disable button while request is being deleted
                  style={{
                    backgroundColor: deletingRequest === registration._id ? '#ddd' : '#E74C3C',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: deletingRequest === registration._id ? 'not-allowed' : 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  {deletingRequest === registration._id ? 'Deleting...' : 'Delete Request'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </>
  );
};

export default AdminDashboard;
