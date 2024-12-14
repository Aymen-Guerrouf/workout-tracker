import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  force: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, "Force can not be more than 50 characters"],
  },
  level: {
    type: String,
    required: [true, "Please add a level"],
    trim: true,
    enum: ["beginner", "intermediate", "expert"],
  },
  primaryMuscles: {
    type: Array,
    required: [true, "Please add primary muscles"],
  },
  secondaryMuscles: {
    type: Array,
    required: false,
  },
  instructions: {
    type: Array,
    required: false,
  },
  UserId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    trim: true,
  },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
