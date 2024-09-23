import React, { useState, useEffect, useMemo } from 'react';
import ExerciseCard from './ExerciseCard';
import ExerciseFilter from './ExerciseFilter';
import AddExerciseForm from './AddExerciseForm';
import TodaysWorkout from './TodaysWorkout';
import './WorkoutPlans.css';
import axios from 'axios';

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

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setIsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3001/exercises', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkoutPlan(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Error fetching exercise data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleAddExercise = async () => {
    if (validateExercise(newExercise)) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3001/exercises/add', newExercise, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNewExercise(defaultExercise);
        fetchExercises(); // Refresh exercises after adding a new one
      } catch (err) {
        console.error('Error adding exercise:', err);
        setError('Error adding exercise');
      }
    } else {
      alert('Please fill out all fields correctly.');
    }
  };

  const validateExercise = (exercise) => {
    return exercise.name && exercise.bodyPart && exercise.equipment && exercise.difficulty  && exercise.restPeriod;
  };

  
  const handleAddToTodaysWorkout = (exercise) => {
    // Check if the exercise is already in todaysWorkout
    const isExerciseInPlan = todaysWorkout.some((ex) => ex._id === exercise._id);
  
    if (!isExerciseInPlan) {
      setTodaysWorkout([...todaysWorkout, { ...exercise, weight: 0, duration: 0 }]);
    } else {
      alert("This exercise is already in your workout plan.");
    }
  };

  const handleSaveWorkout = async (workoutData) => {
    if (todaysWorkout.length === 0) {
      setError('Please add at least one exercise to your workout before saving.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/workout/save', workoutData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Workout saved successfully!');
      setTodaysWorkout([]); // Clear today's workout after saving
    } catch (err) {
      console.error('Error saving workout:', err);
      setError('Error saving workout');
    }
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
        </div>
      </div>

      <ExerciseFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="exercise-list">
        {filteredAndSortedExercises.map((exercise) => (
          <ExerciseCard
            key={exercise._id}
            exercise={exercise}
            onAddToPlan={handleAddToTodaysWorkout}
          />
        ))}
      </div>

      <AddExerciseForm
        newExercise={newExercise}
        setNewExercise={setNewExercise}
        onSubmit={handleAddExercise}
        
      />

      <TodaysWorkout
        todaysWorkout={todaysWorkout}
        onSaveWorkout={handleSaveWorkout}
        onRemoveFromWorkout={(exerciseToRemove) => setTodaysWorkout(todaysWorkout.filter(ex => ex._id !== exerciseToRemove._id))}
      />
    </section>
  );
};

export default WorkoutPlans;
