import React, { useState, useEffect, useMemo } from 'react';
import ExerciseCard from './ExerciseCard';
import ExerciseFilter from './ExerciseFilter';
import AddExerciseForm from './AddExerciseForm';
import TodaysWorkout from './TodaysWorkout';
import './WorkoutPlans.css';

const defaultExercise = {
  name: "",
  bodyPart: "",
  equipment: "",
  difficulty: "",
  sets: 0,
  reps: 0,
  restPeriod: "",
  videoUrl: "",
};

const WorkoutPlans = () => {
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [todaysWorkout, setTodaysWorkout] = useState([]);
  const [newExercise, setNewExercise] = useState(defaultExercise);
  const [filters, setFilters] = useState({
    bodyPart: [],
    equipment: [],
    difficulty: [],
  });
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('src/data/exercises.json')
      .then(response => response.json())
      .then(data => {
        setWorkoutPlan(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError('Error fetching exercise data');
        setIsLoading(false);
      });
  }, []);

  const handleAddExercise = () => {
    if (validateExercise(newExercise)) {
      setWorkoutPlan([...workoutPlan, { ...newExercise, id: workoutPlan.length + 1 }]);
      setNewExercise(defaultExercise);
    } else {
      alert('Please fill out all fields correctly.');
    }
  };

  const validateExercise = (exercise) => {
    return exercise.name && exercise.bodyPart && exercise.equipment && exercise.difficulty && exercise.sets > 0 && exercise.reps > 0 && exercise.restPeriod;
  };

  const handleAddToTodaysWorkout = (exercise) => {
    setTodaysWorkout([...todaysWorkout, exercise]);
  };

  const handleFilterChange = (type, value) => {
    setFilters({
      ...filters,
      [type]: filters[type].includes(value)
        ? filters[type].filter((item) => item !== value)
        : [...filters[type], value],
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const filteredAndSortedExercises = useMemo(() => {
    return workoutPlan
      .filter((exercise) => {
        if (filters.bodyPart.length > 0 && !filters.bodyPart.includes(exercise.bodyPart)) {
          return false;
        }
        if (filters.equipment.length > 0 && !filters.equipment.includes(exercise.equipment)) {
          return false;
        }
        if (filters.difficulty.length > 0 && !filters.difficulty.includes(exercise.difficulty)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "difficulty":
            return a.difficulty.localeCompare(b.difficulty);
          case "equipment":
            return a.equipment.localeCompare(b.equipment);
          case "bodyPart":
            return a.bodyPart.localeCompare(b.bodyPart);
          default:
            return 0;
        }
      });
  }, [workoutPlan, filters, sortBy]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="container">
      <div className="header">
        <div className="title">
          <h1>Workout Plan</h1>
          <p>Customize and manage your workout routines.</p>
        </div>
        <div className="controls">
          <select onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
            <option value="name">Name</option>
            <option value="difficulty">Difficulty</option>
            <option value="equipment">Equipment</option>
            <option value="bodyPart">Body Part</option>
          </select>
          <button onClick={() => { /* Show/hide filter options */ }}>
            <span>Filters</span>
          </button>
        </div>
      </div>

      <ExerciseFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="exercise-list">
        {filteredAndSortedExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onAddToPlan={handleAddToTodaysWorkout}
          />
        ))}
      </div>

      <AddExerciseForm
        newExercise={newExercise}
        setNewExercise={setNewExercise}
        onAddExercise={handleAddExercise}
      />

      <TodaysWorkout
        todaysWorkout={todaysWorkout}
        onRemoveFromWorkout={(exerciseToRemove) => setTodaysWorkout(todaysWorkout.filter(ex => ex.id !== exerciseToRemove.id))}
      />
    </section>
  );
};

export default WorkoutPlans;
