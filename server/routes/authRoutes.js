import express from "express";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  loginUser
);

router.get("/me", protect, getProfile);
router.put("/me", protect, [body("name").optional().notEmpty().withMessage("Name cannot be empty")], updateProfile);
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
  ],
  changePassword
);
router.delete("/me", protect, deleteAccount);

export default router;
