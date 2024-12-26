import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import

const AddExerciseForm = ({ newExercise, setNewExercise, onSubmit }) => {
  const [errors, setErrors] = useState({});

  // Function to handle input changes
  const handleChange = (field, value) => {
    setNewExercise({
      ...newExercise,
      [field]: value,
    });
  };

  // Function to extract user ID from JWT token
  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken._id; // Ensure this matches your token's structure
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Form validation function
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!newExercise.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    if (!newExercise.bodyPart.trim()) {
      newErrors.bodyPart = 'Body part is required.';
      isValid = false;
    }

    if (!newExercise.equipment.trim()) {
      newErrors.equipment = 'Equipment is required.';
      isValid = false;
    }

    if (!newExercise.difficulty || newExercise.difficulty === 'Select difficulty') {
      newErrors.difficulty = 'Difficulty is required.';
      isValid = false;
    } else if (!['Beginner', 'Intermediate', 'Advanced'].includes(newExercise.difficulty)) {
      newErrors.difficulty = 'Invalid difficulty level.';
      isValid = false;
    }


    if (!newExercise.restPeriod.trim()) {
      newErrors.restPeriod = 'Rest period is required.';
      isValid = false;
    }

    if (!newExercise.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required.';
      isValid = false;
    } else if (
      !/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/i.test(newExercise.videoUrl)
    ) {
      newErrors.videoUrl = 'Video URL must be a valid YouTube URL.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to handle adding a new exercise
  const onAddExercise = async () => {
    if (!validateForm()) {
      alert('Please fill out all fields properly.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      const userId = getUserIdFromToken(token);

      const exerciseToSave = {
        ...newExercise,
        createdBy: userId,
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
        onSubmit();
        setErrors({});
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
        {Object.keys(newExercise).map((field) =>
          field === 'difficulty' ? (
            <label key={field}>
              Difficulty
              <select
                value={newExercise[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              >
                <option value="Select difficulty">Select difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.difficulty && <span className="error">{errors.difficulty}</span>}
            </label>
          ) : (
            <label key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                type={field === 'sets' || field === 'reps' ? 'number' : 'text'}
                value={newExercise[field]}
                onChange={(e) =>
                  handleChange(
                    field,
                    field === 'sets' || field === 'reps'
                      ? Math.max(0, Number(e.target.value)) // Ensure sets/reps are never less than 0
                      : e.target.value
                  )
                }
              />
              {errors[field] && <span className="error">{errors[field]}</span>}
            </label>
          )
        )}
        <button onClick={onAddExercise}>Add Exercise</button>
      </div>
    </div>
  );
};

export default AddExerciseForm;
