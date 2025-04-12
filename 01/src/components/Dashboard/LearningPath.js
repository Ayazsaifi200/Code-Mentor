import React from 'react';
import ProgressBar from './ProgressBar';
import ExerciseCard from './ExerciseCard';

const LearningPath = () => {
  const exercises = [
    { id: 1, title: 'Variables & Data Types', completed: true, difficulty: 'Beginner' },
    { id: 2, title: 'Functions & Scope', completed: true, difficulty: 'Beginner' },
    { id: 3, title: 'Control Flow', completed: false, difficulty: 'Intermediate' },
    { id: 4, title: 'Error Handling', completed: false, difficulty: 'Intermediate' },
    { id: 5, title: 'Async Programming', completed: false, difficulty: 'Advanced' }
  ];

  const progress = {
    current: 2,
    total: 5,
    percentage: 40
  };

  return (
    <div className="learning-path">
      <h2 className="path-title">JavaScript Fundamentals</h2>
      <ProgressBar progress={progress} />
      
      <div className="exercises-container">
        {exercises.map(exercise => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};

export default LearningPath;