import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import './TodaysWorkout.css';

const TodaysWorkout = ({ todaysWorkout, onRemoveFromWorkout }) => {
  const baseWorkoutName = "Today's Workout";
  const [workoutName, setWorkoutName] = useState(`${baseWorkoutName}: `);
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (event) => {
    const userInput = event.target.value;
    if (userInput.startsWith(baseWorkoutName)) {
      setWorkoutName(userInput);
    }
  };

  const handleNameEdit = () => {
    setIsEditing(true);
  };

  const handleNameSave = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="container todays-workout">
      <div className="header">
        {isEditing ? (
          <input
            type="text"
            value={workoutName}
            onChange={handleNameChange}
            onKeyDown={handleNameSave}
            className="workout-name-input"
          />
        ) : (
          <h2 className="title" onClick={handleNameEdit}>
            {workoutName}
          </h2>
        )}
      </div>
      <div className="exercise-list">
        {todaysWorkout.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onRemove={onRemoveFromWorkout}
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysWorkout;
