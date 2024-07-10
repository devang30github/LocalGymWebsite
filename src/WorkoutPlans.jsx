import { useState, useMemo } from "react";
import './WorkoutPlans.css';
export default function WorkoutPlans() {
  const [workoutPlan, setWorkoutPlan] = useState([
    {
      id: 1,
      name: "Barbell Bench Press",
      bodyPart: "Chest",
      equipment: "Barbell",
      difficulty: "Intermediate",
      sets: 3,
      reps: 10,
      restPeriod: "60 seconds",
      videoUrl: "https://www.example.com/barbell-bench-press",
    },
    {
      id: 2,
      name: "Dumbbell Bicep Curl",
      bodyPart: "Arms",
      equipment: "Dumbbell",
      difficulty: "Beginner",
      sets: 3,
      reps: 12,
      restPeriod: "45 seconds",
      videoUrl: "https://www.example.com/dumbbell-bicep-curl",
    },
    {
      id: 3,
      name: "Squats",
      bodyPart: "Legs",
      equipment: "Barbell",
      difficulty: "Advanced",
      sets: 4,
      reps: 8,
      restPeriod: "90 seconds",
      videoUrl: "https://www.example.com/squats",
    },
    {
      id: 4,
      name: "Lat Pulldown",
      bodyPart: "Back",
      equipment: "Cable Machine",
      difficulty: "Intermediate",
      sets: 3,
      reps: 10,
      restPeriod: "60 seconds",
      videoUrl: "https://www.example.com/lat-pulldown",
    },
  ]);

  const [newExercise, setNewExercise] = useState({
    name: "",
    bodyPart: "",
    equipment: "",
    difficulty: "",
    sets: 0,
    reps: 0,
    restPeriod: "",
    videoUrl: "",
  });

  const [filters, setFilters] = useState({
    bodyPart: [],
    equipment: [],
    difficulty: [],
  });

  const [sortBy, setSortBy] = useState("name");

  const handleAddExercise = () => {
    setWorkoutPlan([...workoutPlan, { ...newExercise, id: workoutPlan.length + 1 }]);
    setNewExercise({
      name: "",
      bodyPart: "",
      equipment: "",
      difficulty: "",
      sets: 0,
      reps: 0,
      restPeriod: "",
      videoUrl: "",
    });
  };

  const handleEditExercise = (id, updates) => {
    setWorkoutPlan(workoutPlan.map((exercise) => (exercise.id === id ? { ...exercise, ...updates } : exercise)));
  };

  const handleRemoveExercise = (id) => {
    setWorkoutPlan(workoutPlan.filter((exercise) => exercise.id !== id));
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
          <button onClick={() => {}}>
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="secondsectionHeader">Body Part</label>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={filters.bodyPart.includes("Chest")}
                onChange={() => handleFilterChange("bodyPart", "Chest")}
              />
              Chest
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.bodyPart.includes("Arms")}
                onChange={() => handleFilterChange("bodyPart", "Arms")}
              />
              Arms
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.bodyPart.includes("Legs")}
                onChange={() => handleFilterChange("bodyPart", "Legs")}
              />
              Legs
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.bodyPart.includes("Back")}
                onChange={() => handleFilterChange("bodyPart", "Back")}
              />
              Back
            </label>
          </div>
        </div>

        <div className="filter-group">
          <label className="secondsectionHeader">Equipment</label>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={filters.equipment.includes("Barbell")}
                onChange={() => handleFilterChange("equipment", "Barbell")}
              />
              Barbell
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.equipment.includes("Dumbbell")}
                onChange={() => handleFilterChange("equipment", "Dumbbell")}
              />
              Dumbbell
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.equipment.includes("Cable Machine")}
                onChange={() => handleFilterChange("equipment", "Cable Machine")}
              />
              Cable Machine
            </label>
          </div>
        </div>

        <div className="filter-group">
          <label className="secondsectionHeader">Difficulty</label>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={filters.difficulty.includes("Beginner")}
                onChange={() => handleFilterChange("difficulty", "Beginner")}
              />
              Beginner
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.difficulty.includes("Intermediate")}
                onChange={() => handleFilterChange("difficulty", "Intermediate")}
              />
              Intermediate
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.difficulty.includes("Advanced")}
                onChange={() => handleFilterChange("difficulty", "Advanced")}
              />
              Advanced
            </label>
          </div>
        </div>
      </div>

      <div className="exercise-list">
        {filteredAndSortedExercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-details">
              <h3>{exercise.name}</h3>
              <div className="exercise-meta">
                <span>{exercise.equipment}</span>
                <span>{exercise.difficulty}</span>
                <span>{exercise.sets} sets x {exercise.reps} reps</span>
                <span>{exercise.restPeriod} rest</span>
              </div>
              <div className="exercise-actions">
                <button onClick={() =>
                  handleEditExercise(exercise.id, {
                    sets: exercise.sets + 1,
                    reps: exercise.reps + 2,
                    restPeriod: `${parseInt(exercise.restPeriod) + 15} seconds`,
                  })
                }>
                  Edit
                </button>
                <button onClick={() => handleRemoveExercise(exercise.id)}>Remove</button>
                <a href={exercise.videoUrl} target="_blank">
                  <button>Watch Video</button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-exercise">
        <h2>Add New Exercise</h2>
        <div className="exercise-form">
          <label>
            Name
            <input
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            />
          </label>
          <label>
            Body Part
            <input
              value={newExercise.bodyPart}
              onChange={(e) => setNewExercise({ ...newExercise, bodyPart: e.target.value })}
            />
          </label>
          <label>
            Equipment
            <input
              value={newExercise.equipment}
              onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
            />
          </label>
          <label>
            Difficulty
            <input
              value={newExercise.difficulty}
              onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
            />
          </label>
          <label>
            Sets
            <input
              type="number"
              value={newExercise.sets}
              onChange={(e) => setNewExercise({ ...newExercise, sets: Number(e.target.value) })}
            />
          </label>
          <label>
            Reps
            <input
              type="number"
              value={newExercise.reps}
              onChange={(e) => setNewExercise({ ...newExercise, reps: Number(e.target.value) })}
            />
          </label>
          <label>
            Rest Period
            <input
              value={newExercise.restPeriod}
              onChange={(e) => setNewExercise({ ...newExercise, restPeriod: e.target.value })}
            />
          </label>
          <label>
            Video URL
            <input
              value={newExercise.videoUrl}
              onChange={(e) => setNewExercise({ ...newExercise, videoUrl: e.target.value })}
            />
          </label>
          <button onClick={handleAddExercise}>Add Exercise</button>
        </div>
      </div>
    </section>
  );
}
