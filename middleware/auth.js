import jwt from "jsonwebtoken";
import asyncHandler from "./async.js";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js";

// protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token; // Declare token variable

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Typo here: changed req.headerq to req.headers
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Spelling: changed decode to decoded for clarity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from the token
    req.user = await User.findById(decoded.id);

    // Check if user exists
    if (!req.user) {
      return next(new ErrorResponse("No user found with this token", 401));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
