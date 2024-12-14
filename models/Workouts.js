import mongoose from "mongoose";
import { type } from "os";

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
    staus: {
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

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
