import Exercise from "../models/Exercises.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";

//@desc Get all exercises
//@route GET /api/v1/exercises
//@access Public
export const getExercises = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
