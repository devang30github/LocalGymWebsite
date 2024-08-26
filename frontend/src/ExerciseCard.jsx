import React, { useState, useEffect } from 'react';

const ExerciseCard = ({ exercise, onAddToPlan, onRemove, isInPlan, onWeightChange, onDurationChange }) => {
  const [weight, setWeight] = useState(exercise.weight || 0);
  const [duration, setDuration] = useState(exercise.duration || 0);

  useEffect(() => {
    // Update local state if exercise props change
    setWeight(exercise.weight || 0);
    setDuration(exercise.duration || 0);
  }, [exercise.weight, exercise.duration]);

  const handleWeightChange = (e) => {
    const newWeight = parseFloat(e.target.value) || 0; // Parse to float and default to 0 if invalid
    setWeight(newWeight);
    onWeightChange(exercise._id, newWeight); // Update weight in the parent
  };

  const handleDurationChange = (e) => {
    const newDuration = parseFloat(e.target.value) || 0; // Parse to float and default to 0 if invalid
    setDuration(newDuration);
    onDurationChange(exercise._id, newDuration); // Update duration in the parent
  };

  const handleAddClick = () => {
    onAddToPlan(exercise); // Add exercise to today's workout
  };

  return (
    <div className="exercise-card">
      <div className="exercise-details">
        <h3>{exercise.name}</h3>
        <div className="exercise-meta">
          <span>{exercise.equipment}</span>
          <span>{exercise.difficulty}</span>
          <span>{exercise.sets} sets x {exercise.reps} reps</span>
          <span>{exercise.restPeriod} rest</span>
        </div>
        {isInPlan && (
          <div className="exercise-inputs">
            <label>
              Weight (kg):
              <input 
                type="number" 
                value={weight} 
                onChange={handleWeightChange} 
              />
            </label>
            <label>
              Duration (mins):
              <input 
                type="number" 
                value={duration} 
                onChange={handleDurationChange} 
              />
            </label>
          </div>
        )}
        <div className="exercise-actions">
          <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer">
            <button>Watch Video</button>
          </a>
          {onAddToPlan && !isInPlan && (
            <button onClick={handleAddClick}>
              Add to Plan
            </button>
          )}
          {onRemove && (
            <button onClick={() => onRemove(exercise)}>Remove</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
