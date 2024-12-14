import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(chalk.green.bold(`MongoDB connected... ${conn.connection.host}`));
};

export default connectDB;
