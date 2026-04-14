import { validationResult } from "express-validator";
import Budget from "../models/Budget.js";
import Category from "../models/Category.js";
import recalculateBudgetSpent from "../utils/recalculateBudgetSpent.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
};

const refreshBudgets = async (budgets, userId) => {
  await Promise.all(
    budgets.map((budget) =>
      recalculateBudgetSpent({
        userId,
        categoryId: budget.category._id || budget.category,
        date: new Date(budget.year, budget.month - 1, 1)
      })
    )
  );

  return Budget.find({ _id: { $in: budgets.map((budget) => budget._id) } }).populate("category");
};

export const getBudgets = async (req, res) => {
  const month = Number(req.query.month) || undefined;
  const year = Number(req.query.year) || undefined;
  const query = { user: req.user._id };

  if (month) query.month = month;
  if (year) query.year = year;

  console.log("🔍 getBudgets query:", { userId: req.user._id, month, year, fullQuery: query });

  const budgets = await Budget.find(query).populate("category").sort({ year: -1, month: -1, createdAt: -1 });
  
  console.log(`📦 Found ${budgets.length} budgets`);
  
  const freshBudgets = await refreshBudgets(budgets, req.user._id);
  
  console.log(`✅ Returning ${freshBudgets.length} fresh budgets`);

  res.json({ success: true, data: freshBudgets });
};

export const createBudget = async (req, res) => {
  handleValidation(req, res);

  const { category, amount, month, year } = req.body;
  const categoryDoc = await Category.findOne({
    _id: category,
    $or: [{ isDefault: true }, { user: req.user._id }]
  });

  if (!categoryDoc || categoryDoc.type === "income") {
    return res.status(400).json({ success: false, message: "Select a valid expense category" });
  }

  const existing = await Budget.findOne({ user: req.user._id, category, month, year });
  if (existing) {
    return res.status(400).json({ success: false, message: "Budget already exists for this category and month" });
  }

  const budget = await Budget.create({
    user: req.user._id,
    category,
    amount,
    month,
    year
  });

  await recalculateBudgetSpent({
    userId: req.user._id,
    categoryId: category,
    date: new Date(year, month - 1, 1)
  });

  res.status(201).json({ success: true, data: await Budget.findById(budget._id).populate("category") });
};

export const updateBudget = async (req, res) => {
  handleValidation(req, res);

  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    return res.status(404).json({ success: false, message: "Budget not found" });
  }

  budget.amount = req.body.amount ?? budget.amount;
  await budget.save();

  await recalculateBudgetSpent({
    userId: req.user._id,
    categoryId: budget.category,
    date: new Date(budget.year, budget.month - 1, 1)
  });

  res.json({ success: true, data: await Budget.findById(budget._id).populate("category") });
};

export const deleteBudget = async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    return res.status(404).json({ success: false, message: "Budget not found" });
  }

  await budget.deleteOne();
  res.json({ success: true, message: "Budget deleted successfully" });
};

export const getBudgetStatus = async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const budgets = await Budget.find({ user: req.user._id, month, year }).populate("category");
  const freshBudgets = await refreshBudgets(budgets, req.user._id);

  const totalBudgeted = freshBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = freshBudgets.reduce((sum, budget) => sum + budget.spent, 0);

  res.json({
    success: true,
    data: {
      month,
      year,
      totalBudgeted,
      totalSpent,
      items: freshBudgets.map((budget) => ({
        ...budget.toObject(),
        usage: budget.amount ? budget.spent / budget.amount : 0,
        status: budget.spent >= budget.amount ? "over" : budget.spent / budget.amount >= 0.9 ? "warning" : "safe"
      }))
    }
  });
};
