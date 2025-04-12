const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java'],
      required: true,
    },
    startingCode: {
      type: String,
      default: '',
    },
    solutionCode: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
      },
    ],
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ExerciseSchema.index({ language: 1, difficulty: 1 });
ExerciseSchema.index({ tags: 1 });

module.exports = mongoose.model('Exercise', ExerciseSchema);