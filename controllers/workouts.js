import Workout from "../models/Workouts.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";

//@desc    Get all workouts
//@route   GET /api/v1/workouts
//@access  Private
export const getWorkouts = asyncHandler(async (req, res, next) => {
  console.log(req.user.id);
  res.status(200).json(res.advancedResults);
});

//@desc    Create new workout
//@route   POST /api/v1/workouts
//@access  Private

export const createWorkout = asyncHandler(async (req, res, next) => {
  const { name, description, exercises, note, status } = req.body;
  const workout = await Workout.create({
    name,
    description,
    exercises,
    note,
    status,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: workout,
  });
});

//@desc    Update workout
//@route   PUT /api/v1/workouts/:id
//@access  Private
export const updateWorkout = asyncHandler(async (req, res, next) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  }
  if (req.user.id !== workout.user.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this workout`,
        401
      )
    );
  }

  const updatedWorkout = await Workout.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: updatedWorkout });
});

//@desc    Delete workout
//@route   DELETE /api/v1/workouts/:id
//@access  Private
export const deleteWorkout = asyncHandler(async (req, res, next) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) {
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.id !== workout.user.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this workout`,
        401
      )
    );
  }
  await workout.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, data: {} });
});
