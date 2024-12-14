import express from "express";
import Schedule from "../models/workoutSchedule.js";
import advancedResults from "../middleware/advancedResults.js";
import {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/Schedule.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(protect, advancedResults(Schedule, "workout"), getAllSchedules)
  .post(protect, createSchedule);

router
  .route("/:id")
  .put(protect, updateSchedule)
  .delete(protect, deleteSchedule);

export default router;
