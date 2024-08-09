import React from 'react';

const AddExerciseForm = ({ newExercise, setNewExercise, onAddExercise }) => {
  const handleChange = (field, value) => {
    setNewExercise({
      ...newExercise,
      [field]: value
    });
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
              onChange={(e) => handleChange(field, field === 'sets' || field === 'reps' ? Number(e.target.value) : e.target.value)}
            />
          </label>
        ))}
        <button onClick={onAddExercise}>Add Exercise</button>
      </div>
    </div>
  );
};

export default AddExerciseForm;
