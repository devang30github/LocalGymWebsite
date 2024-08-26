import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './Dashboard.css';

const Dashboard = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch workout history
        const workoutResponse = await axios.get('http://localhost:3001/workout/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkoutHistory(workoutResponse.data);

        // Fetch user stats
        const statsResponse = await axios.get('http://localhost:3001/user/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserStats(statsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="user-stats">
        <h2>User Stats</h2>
        <p>Total Workouts: {userStats.totalWorkouts}</p>
        <p>Total Time Spent: {userStats.totalTime} hours</p>
        <p>Average Workout Duration: {userStats.avgDuration} minutes</p>
      </div>

      <div className="workout-history">
        <h2>Workout History</h2>
        {workoutHistory.length > 0 ? (
          <ul>
            {workoutHistory.map((workout) => (
              <li key={workout._id}>
                <p><strong>{workout.name}</strong></p>
                <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
                <p>Duration: {workout.duration} minutes</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts recorded.</p>
        )}
      </div>

      <div className="performance-analytics">
        <h2>Performance Analytics</h2>
        <p>Track your performance over time. More data and charts can be added here.</p>
        {/* Placeholder for future analytics charts */}
      </div>
    </div>
  );
};

export default Dashboard;
