import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer';
import './Dashboard.css'
const Dashboard = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
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

        // Fetch workout history with populated exercises
        const workoutResponse = await axios.get('http://localhost:3001/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <NavBar/>
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="workout-history">
        <h2>Workout History</h2>
        {workoutHistory.length > 0 ? (
          <ul>
            {workoutHistory.map((workout) => (
              <li key={workout._id}>
                <p><strong>Workout Name:</strong> {workout.name}</p>
                <p><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
                <p><strong>Exercises Performed:</strong></p>
                <ul>
                  {workout.exercises.map((exercise) => (
                    <li key={exercise.exerciseId._id}>
                      <p>Exercise Name: {exercise.exerciseId.name}</p>
                      <p>Weight: {exercise.weight} kg</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts recorded.</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Dashboard;
