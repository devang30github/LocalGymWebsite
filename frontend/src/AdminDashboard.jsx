import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from './AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import ContactMessages from './ContactMessages';


const AdminDashboard = () => {
  const { isAdminAuthenticated, AdminLogout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [sendingNotification, setSendingNotification] = useState(null); // To track which notification is being sent

  useEffect(() => {
    fetchRegistrations();
    fetchActiveUsers();
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    AdminLogout();
    navigate('/adminlogin');
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('AdminToken')}`,
        },
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

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/active-users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('AdminToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch active users');
      const data = await response.json();
      setActiveUsers(data);
    } catch (error) {
      setError('Error fetching active users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/dashboard-summary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('AdminToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard summary');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      setError('Error fetching dashboard data: ' + error.message);
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

  const handleSendRenewalNotification = async (userId) => {
    try {
      setSendingNotification(userId);
      const response = await fetch('http://localhost:3001/admin/send-renewal-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('AdminToken')}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchUpcomingRenewals(); // Refresh the renewals list
      } else {
        alert('Error sending notification: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    } finally {
      setSendingNotification(null);
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
      
      <div>
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
        >
          Logout
        </button>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>{dashboardData.totalUsers || 0}</p>
          </div>
          <div className="card">
            <h3>Current Month Revenue</h3>
            <p>₹{dashboardData.monthlyRevenue || 0}</p>
          </div>
          <div className="card">
            <h3>New Registrations</h3>
            <p>{dashboardData.newRegistrations || 0}</p>
          </div>
      </div>

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
                >
                  {sendingOtp === registration._id ? 'Sending...' : 'Send OTP'}
                </button>
                <button
                  onClick={() => handleDeleteRequest(registration._id)}
                  disabled={deletingRequest === registration._id} // Disable button while request is being deleted
                  
                >
                  {deletingRequest === registration._id ? 'Deleting...' : 'Delete Request'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Active Users</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if any */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Membership Type</th>
            <th>Membership Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.membershipType ? user.membershipType.name : 'N/A'}</td>
              <td>{new Date(user.membershipExpiryDate).toDateString()}</td>
              <td>
                <button
                  onClick={() => handleSendRenewalNotification(user._id)}
                  disabled={sendingNotification === user._id}
                
                >
                  {sendingNotification === user._id ? 'Sending...' : 'Send Notification'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ContactMessages />
      </div>
    </>
  );
};

export default AdminDashboard;
