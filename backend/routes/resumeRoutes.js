import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../utils/cloudinary.js";
import { uploadResume, getResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/", protect, upload.single("resume"), uploadResume);
router.get("/", protect, getResume);

export default router;
