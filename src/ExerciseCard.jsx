import React from 'react';

const ExerciseCard = ({ exercise, onAddToPlan, onRemove }) => {
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
        <div className="exercise-actions">
          <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer">
            <button>Watch Video</button>
          </a>
          {onAddToPlan && (
            <button onClick={() => onAddToPlan(exercise)}>Add to Plan</button>
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
