/*ExerciseFilter.jsx*/
import React from 'react';

const ExerciseFilter = ({ filters, onFilterChange }) => {
  const renderFilterOptions = (options, type) => {
    return options.map((option) => (
      <label key={option}>
        <input
          type="checkbox"
          checked={filters && filters[type] && filters[type].includes(option)}
          onChange={() => onFilterChange(type, option)}
        />
        {option}
      </label>
    ));
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label className="secondsectionHeader">Body Part</label>
        <div className="filter-options">
          {renderFilterOptions(["Chest", "Tricep", "Bicep", "Back", "Shoulders", "Legs", "Core"], "bodyPart")}
        </div>
      </div>

      <div className="filter-group">
        <label className="secondsectionHeader">Equipment</label>
        <div className="filter-options">
          {renderFilterOptions(["Barbell", "Dumbbell", "Cable"], "equipment")}
        </div>
      </div>

      <div className="filter-group">
        <label className="secondsectionHeader">Difficulty</label>
        <div className="filter-options">
          {renderFilterOptions(["Beginner", "Intermediate", "Advanced"], "difficulty")}
        </div>
      </div>
    </div>
  );
};

export default ExerciseFilter;
