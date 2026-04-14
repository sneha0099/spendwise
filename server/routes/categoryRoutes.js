import express from "express";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(protect);

router.get("/", getCategories);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Category name is required"),
    body("type").isIn(["income", "expense", "both"]).withMessage("Invalid category type")
  ],
  createCategory
);
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Category name cannot be empty"),
    body("type").optional().isIn(["income", "expense", "both"]).withMessage("Invalid category type")
  ],
  updateCategory
);
router.delete("/:id", deleteCategory);

export default router;
