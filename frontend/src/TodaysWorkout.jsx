import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import './TodaysWorkout.css';

const TodaysWorkout = ({ todaysWorkout, onRemoveFromWorkout, onSaveWorkout }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [sleepHours, setSleepHours] = useState(0);
  const [hydrationLevel, setHydrationLevel] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [muscleSoreness, setMuscleSoreness] = useState(0);
  const [todaysWorkoutstate, setTodaysWorkout] = useState(todaysWorkout);

  // Sync local state with props changes
  useEffect(() => {
    setTodaysWorkout(todaysWorkout);
  }, [todaysWorkout]);

  const handleWeightChange = (exerciseId, newWeight) => {
    setTodaysWorkout(todaysWorkoutstate.map(ex => 
      ex._id === exerciseId ? { ...ex, weight: parseFloat(newWeight) } : ex
    ));
  };

  const handleDurationChange = (exerciseId, newDuration) => {
    setTodaysWorkout(todaysWorkoutstate.map(ex => 
      ex._id === exerciseId ? { ...ex, duration: parseFloat(newDuration) } : ex
    ));
  };

  const handleNameChange = (event) => {
    setWorkoutName(event.target.value);
  };

  const handleSaveWorkout = () => {
    if (workoutName.trim() === "") {
      alert("Please enter a workout name before saving.");
      return;
    }

    const workoutData = {
      workoutName,
      exercises: todaysWorkoutstate, // Use the local state for saving
      conditions: {
        timeOfDay,
        sleepHours,
        hydrationLevel,
      },
      subjectiveFeedback: {
        energyLevel,
        muscleSoreness,
      }
    };

    onSaveWorkout(workoutData); // Pass the entire workout data object
  };

  return (
    <div className="container todays-workout">
      <div className="header">
        <label htmlFor="workoutName">Today's Workout Name:</label>
        <input
          type="text"
          id="workoutName"
          value={workoutName}
          onChange={handleNameChange}
          className="workout-name-input"
        />
      </div>
      <div className="exercise-list">
        {todaysWorkoutstate.map((exercise) => (
          <div key={exercise._id} className="exercise-card-wrapper">
            <ExerciseCard
              exercise={exercise}
              onRemove={onRemoveFromWorkout}
              isInPlan={true} // Pass this prop to indicate the exercise is in the plan
              onWeightChange={handleWeightChange}
              onDurationChange={handleDurationChange}
            />
          </div>
        ))}
      </div>
      <div className="conditions">
        <label htmlFor="timeOfDay">Time of Day:</label>
        <input
          type="text"
          id="timeOfDay"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value)}
        />
        <label htmlFor="sleepHours">Sleep Hours:</label>
        <input
          type="number"
          id="sleepHours"
          value={sleepHours}
          onChange={(e) => setSleepHours(parseFloat(e.target.value))}
        />
        <label htmlFor="hydrationLevel">Hydration Level:</label>
        <input
          type="number"
          id="hydrationLevel"
          value={hydrationLevel}
          onChange={(e) => setHydrationLevel(parseFloat(e.target.value))}
        />
      </div>
      <div className="subjective-feedback">
        <label htmlFor="energyLevel">Energy Level:</label>
        <input
          type="number"
          id="energyLevel"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseFloat(e.target.value))}
        />
        <label htmlFor="muscleSoreness">Muscle Soreness:</label>
        <input
          type="number"
          id="muscleSoreness"
          value={muscleSoreness}
          onChange={(e) => setMuscleSoreness(parseFloat(e.target.value))}
        />
      </div>
      <button onClick={handleSaveWorkout}>Save Workout</button>
    </div>
  );
};

export default TodaysWorkout;
