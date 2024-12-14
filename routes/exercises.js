import express from "express";
import { getExercises } from "../controllers/exercises.js";
import advancedResults from "../middleware/advancedResults.js";
import Exercise from "../models/Exercises.js";

const router = express.Router();

router.route("/").get(advancedResults(Exercise), getExercises);

export default router;
