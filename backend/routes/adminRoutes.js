import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import {
  getPlatformStats,
  listUsers,
  updateUserRole,
  setUserActive,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin")); // every route below requires admin role

router.get("/stats", getPlatformStats);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/active", setUserActive);

export default router;
