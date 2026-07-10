import express from "express";
import passport from "passport";
import { oauthCallback, getMe, logout } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// ---- Google ----
router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
  oauthCallback
);

// ---- GitHub ----
router.get(
  "/github",
  authLimiter,
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=github` }),
  oauthCallback
);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
