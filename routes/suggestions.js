import express from "express";
import { getSuggestions } from "../controllers/suggestions.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(protect, getSuggestions);

export default router;
