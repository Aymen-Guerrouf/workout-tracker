import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import chalk from "chalk";
import error from "./middleware/error.js";
import checkSchedule from "./jobs/notify.js";
//load env vars
dotenv.config({ path: "./config/config.env" });

// routes
import exercises from "./routes/exercises.js";
import workout from "./routes/workout.js";
import auth from "./routes/auth.js";
import schedule from "./routes/schedule.js";
import suggestion from "./routes/suggestions.js";

// connect to db
connectDB();

const app = express();
// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// mount routers
app.use("/api/v1/exercises", exercises);
app.use("/api/v1/workouts", workout);
app.use("/api/v1/auth", auth);
app.use("/api/v1/schedule", schedule);
app.use("/api/v1/suggestions", suggestion);

app.use(error);

checkSchedule();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(
    chalk.cyan.bold(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
