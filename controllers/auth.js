import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendRestEmail } from "../utils/sendemail.js";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // create user
  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

export const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  /*   const isMatch = await user.matchPassword(password);
   */
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc  logout user
// @route GET /api/v1/auth/logout
// @access private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc upadate user details
//@route PUT /api/v1/auth/update
//@access private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc update password
//@route PUT /api/v1/auth/updatepassword
//@access private

export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  user.password = req.body.newpassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc    forget password
// @route   POST /api/v1/auth/forgetpassword
// @access  Public

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 360000;
  user.save({ validateBeforeSave: false });

  await sendRestEmail(user.email, token);
  res.status(200).json({
    success: true,
    data: "Email sent",
  });
});

// @desc    reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.resettoken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
