import { schedule } from "node-cron";
import asyncHandler from "../middleware/async.js";
import Schedule from "../models/workoutSchedule.js";
import ErrorResponse from "../utils/errorResponse.js";

//@desc create a schedule
//@route POST /api/v1/schedule
//@access Private
export const createSchedule = asyncHandler(async (req, res, next) => {
  const { title, date, note, workout } = req.body;

  const plan = await Schedule.create({
    title,
    date,
    note,
    workout,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: plan,
  });
});

//@desc get all schedules
//@route GET /api/v1/schedule
//@access Private
export const getAllSchedules = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc update  schedules
//@route PUT /api/v1/schedule/:id
//@access Private

export const updateSchedule = asyncHandler(async (req, res, next) => {
  const plan = await Schedule.findById(req.params.id);

  if (!plan) {
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.id !== plan.user.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this workout`,
        401
      )
    );
  }

  const updatedPlan = await Schedule.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: updatedPlan });
});

//@desc delete a schedule
//@route DELETE /api/v1/schedule/:id
//@access Private
export const deleteSchedule = asyncHandler(async (req, res, next) => {
  const plan = await Schedule.findById(req.params.id);
  if (!plan) {
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.id !== plan.user.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this workout`,
        401
      )
    );
  }
  plan.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, data: {} });
});
