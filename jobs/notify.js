import cron from "node-cron";
import Schedule from "../models/workoutSchedule.js";
import asyncHandler from "../middleware/async.js";
import { sendEmail } from "../utils/sendemail.js";

const checkSchedule = asyncHandler(async () => {
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 99));

  const schedule = await Schedule.find({
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    isNotified: false,
  }).populate("user");

  if (schedule === 0) {
    return;
  }

  for (const task of schedule) {
    await sendEmail(task.user);
    console.log(`notification sent for ${task.user.email}`);
    task.isNotified = true;
    await task.save();
  }
});
// just check
cron.schedule("* * * * *", checkSchedule);

export default checkSchedule;
