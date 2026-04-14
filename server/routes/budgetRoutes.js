import express from "express";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetStatus
} from "../controllers/budgetController.js";

const router = express.Router();

router.use(protect);

router.get("/", getBudgets);
router.get("/status", getBudgetStatus);
router.post(
  "/",
  [
    body("category").notEmpty().withMessage("Category is required"),
    body("amount").isFloat({ min: 0 }).withMessage("Budget amount must be positive"),
    body("month").isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),
    body("year").isInt().withMessage("Year is required")
  ],
  createBudget
);
router.put("/:id", [body("amount").isFloat({ min: 0 }).withMessage("Budget amount must be positive")], updateBudget);
router.delete("/:id", deleteBudget);

export default router;
