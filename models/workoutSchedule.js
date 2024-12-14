import mongoose from "mongoose";

const WorkoutScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    workout: {
      type: mongoose.Schema.ObjectId,
      ref: "Workout",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", WorkoutScheduleSchema);
export default Schedule;
