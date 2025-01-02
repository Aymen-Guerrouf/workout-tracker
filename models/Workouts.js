import mongoose from "mongoose";
import Exercise from "./Exercises.js";

const WorkoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      minlength: [4, "Name can not be less than 4 characters"],
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    description: {
      type: String,
      required: false,
    },
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.ObjectId,
          ref: "Exercise",
          required: true,
        },
        name: {
          type: String,
        },
        sets: {
          type: Number,
          required: true,
        },
        reps: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          required: false,
        },
        restTime: {
          type: Number,
          required: false,
          min: 0,
          max: 300, // 5 minutes
        },
      },
    ],
    status: {
      // Fixed the typo here
      type: String,
      enum: ["planned", "cancelled", "completed"],
      default: "planned",
    },
    notes: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WorkoutSchema.pre("save", async function (next) {
  for (const exercise of this.exercises) {
    const exerciseData = await Exercise.findById(exercise.exercise); // Fixed field name
    exercise.name = exerciseData.name;
  }
  next();
});

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
