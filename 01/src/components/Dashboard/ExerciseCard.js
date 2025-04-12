import React from 'react';

const ExerciseCard = ({ exercise }) => {
  return (
    <div className={`exercise-card ${exercise.completed ? 'completed' : ''}`}>
      <div className="exercise-header">
        <h3 className="exercise-title">{exercise.title}</h3>
        <span className={`exercise-difficulty ${exercise.difficulty.toLowerCase()}`}>
          {exercise.difficulty}
        </span>
      </div>
      
      <div className="exercise-status">
        {exercise.completed ? (
          <span className="status-completed">✓ Completed</span>
        ) : (
          <button className="start-button">Start Exercise</button>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;