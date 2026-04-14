import express from "express";
import { body } from "express-validator";
import protect from "../middleware/authMiddleware.js";
import {
  upload,
  getTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  exportTransactionsCsv,
  importTransactionsCsv
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(protect);

const transactionValidation = [
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("paymentMethod")
    .optional()
    .isIn(["cash", "card", "upi", "bank transfer", "other"])
    .withMessage("Invalid payment method")
];

router.get("/", getTransactions);
router.get("/summary", getSummary);
router.get("/export/csv", exportTransactionsCsv);
router.post("/import/csv", upload.single("file"), importTransactionsCsv);
router.post("/", transactionValidation, createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", transactionValidation, updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
