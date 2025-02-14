import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const workoutResponse = await axios.get('http://localhost:3001/history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWorkoutHistory(workoutResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterWorkouts = workoutHistory.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader">Loading...</div>; // Add a spinner or loader component
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <h1>Welcome Back!</h1>
        <p>
          Your fitness journey so far! 💪 Here’s a summary of your workout history:
        </p>

        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Workouts</h3>
            <p>{workoutHistory.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Weight Lifted</h3>
            <p>
              {workoutHistory.reduce((acc, workout) => {
                return acc + workout.exercises.reduce((sum, exercise) => sum + exercise.weight, 0);
              }, 0)}{' '}
              kg
            </p>
          </div>
        </div>

        <div className="filter-section">
          <input
            type="text"
            placeholder="Search by workout name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="workout-history">
          <h2>Workout History</h2>
          {filterWorkouts.length > 0 ? (
            <div className="workout-cards">
              {filterWorkouts.map((workout) => (
                <div className="workout-card" key={workout._id}>
                  <h3>{workout.name}</h3>
                  <p>
                    <strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Exercises:</strong>
                  </p>
                  <ul>
                    {workout.exercises.map((exercise) => (
                      <li key={exercise.exerciseId._id}>
                        {exercise.exerciseId.name} - {exercise.weight} kg
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No workouts recorded.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
