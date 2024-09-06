import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import './TodaysWorkout.css';

const TodaysWorkout = ({ todaysWorkout, onRemoveFromWorkout, onSaveWorkout }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [sleepHours, setSleepHours] = useState("0");
  const [hydrationLevel, setHydrationLevel] = useState("0");
  const [energyLevel, setEnergyLevel] = useState("0");
  const [muscleSoreness, setMuscleSoreness] = useState("0");
  const [todaysWorkoutstate, setTodaysWorkout] = useState(todaysWorkout);

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
    if (!timeOfDay) {
      alert("Please select a valid time of day.");
      return;
    }
    if (todaysWorkoutstate.length === 0) {
      alert("Please add at least one exercise to the workout plan.");
      return;
    }

    // Validate duration for each exercise
    const invalidExercises = todaysWorkoutstate.filter(exercise => exercise.duration <= 0);
    if (invalidExercises.length > 0) {
      alert("All exercises must have a duration greater than 0.");
      return;
    }

    const workoutData = {
      workoutName,
      exercises: todaysWorkoutstate,
      conditions: {
        timeOfDay,
        sleepHours: parseFloat(sleepHours),
        hydrationLevel: parseFloat(hydrationLevel),
      },
      subjectiveFeedback: {
        energyLevel: parseFloat(energyLevel),
        muscleSoreness: parseFloat(muscleSoreness),
      }
    };

    console.log("Saving workout data:", workoutData);
    onSaveWorkout(workoutData);
    // Clear input fields after successful save
    setWorkoutName("");
    setTimeOfDay("select");
    setSleepHours(0);
    setHydrationLevel(0);
    setEnergyLevel(0);
    setMuscleSoreness(0);
    setTodaysWorkout([]);
  };

  const handleSelectChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleNumberChange = (setter) => (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setter(value);
    }
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
              isInPlan={true}
              onWeightChange={handleWeightChange}
              onDurationChange={handleDurationChange}
            />
          </div>
        ))}
      </div>
      <div className="conditions">
        <label htmlFor="timeOfDay">Time of Day:</label>
        <select
          id="timeOfDay"
          value={timeOfDay}
          onChange={handleSelectChange(setTimeOfDay)}
        >
          <option value="">Select</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        <label htmlFor="sleepHours">Sleep Hours:</label>
        <select
          id="sleepHours"
          value={sleepHours}
          onChange={handleNumberChange(setSleepHours)}
        >
          {[...Array(12).keys()].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <label htmlFor="hydrationLevel">Hydration Level:</label>
        <select
          id="hydrationLevel"
          value={hydrationLevel}
          onChange={handleNumberChange(setHydrationLevel)}
        >
          {[...Array(11).keys()].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div className="subjective-feedback">
        <label htmlFor="energyLevel">Energy Level:</label>
        <select
          id="energyLevel"
          value={energyLevel}
          onChange={handleNumberChange(setEnergyLevel)}
        >
          {[...Array(11).keys()].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <label htmlFor="muscleSoreness">Muscle Soreness:</label>
        <select
          id="muscleSoreness"
          value={muscleSoreness}
          onChange={handleNumberChange(setMuscleSoreness)}
        >
          {[...Array(11).keys()].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSaveWorkout}>Save Workout</button>
    </div>
  );
};

export default TodaysWorkout;
