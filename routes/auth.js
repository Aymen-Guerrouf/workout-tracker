import express from "express";
import {
  logIn,
  register,
  logout,
  updatePassword,
  updateUser,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

import { protect } from "../middleware/auth.js";

router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/logout").get(protect, logout);
router.route("/updatepassword").put(protect, updatePassword);
router.route("/update").put(protect, updateUser);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);

export default router;
