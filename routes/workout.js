import express from "express";
import Workout from "../models/Workouts.js";
import advancedResults from "../middleware/advancedResults.js";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workouts.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, advancedResults(Workout, "exercises.exercise"), getWorkouts)
  .post(protect, createWorkout);

router.route("/:id").put(protect, updateWorkout).delete(protect, deleteWorkout);

export default router;
