import React from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";



const AddExerciseForm = ({ newExercise, setNewExercise, onAddExerciseSuccess }) => {
  const handleChange = (field, value) => {
    setNewExercise({
      ...newExercise,
      [field]: value,
    });
  };

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken._id; // Replace with the correct field if different
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const onAddExercise = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      // Assume a function to extract userId from token
      const userId = getUserIdFromToken(token); 

      const exerciseToSave = {
        ...newExercise,
        createdBy: userId, // Add createdBy field
      };

      const response = await axios.post(
        'http://localhost:3001/exercises/add',
        exerciseToSave,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Exercise added successfully!');
        onAddExerciseSuccess(); // Callback to refresh or reset form
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('There was an error adding the exercise.');
    }
  };

  return (
    <div className="add-exercise">
      <h2>Add New Exercise</h2>
      <div className="exercise-form">
        {Object.keys(newExercise).map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            <input
              type={field === 'sets' || field === 'reps' ? 'number' : 'text'}
              value={newExercise[field]}
              onChange={(e) =>
                handleChange(
                  field,
                  field === 'sets' || field === 'reps'
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
            />
          </label>
        ))}
        <button onClick={onAddExercise}>Add Exercise</button>
      </div>
    </div>
  );
};

export default AddExerciseForm;
