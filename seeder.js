import mongoose from "mongoose";
import fs from "fs";
import chalk from "chalk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
import Exercise from "./models/Exercises.js";

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/data.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    Exercise.create(data);
    console.log(chalk.bgGreen.bold("Data Imported..."));
  } catch (error) {
    console.error(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    Exercise.deleteMany();
    console.log(chalk.bgRed.bold("Data Destroyed..."));
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
