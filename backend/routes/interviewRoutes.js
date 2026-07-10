import express from "express";
import { protect } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimit.js";
import { validate, schemas } from "../middleware/validate.js";
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterview,
  listInterviews,
  getDashboardStats,
} from "../controllers/interviewController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/", protect, validate({ query: schemas.interviewQuery }), listInterviews);
router.post("/", protect, aiLimiter, validate({ body: schemas.startInterview }), startInterview);
router.get("/:id", protect, getInterview);
router.post(
  "/:id/answer",
  protect,
  aiLimiter,
  validate({ body: schemas.submitAnswer }),
  submitAnswer
);
router.post("/:id/complete", protect, completeInterview);

export default router;
