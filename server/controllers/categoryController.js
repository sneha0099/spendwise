import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
};

export const getCategories = async (req, res) => {
  const categories = await Category.find({
    $or: [{ isDefault: true }, { user: req.user._id }]
  }).sort({ isDefault: -1, name: 1 });

  const counts = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));

  res.json({
    success: true,
    data: categories.map((category) => ({
      ...category.toObject(),
      transactionCount: countMap.get(String(category._id)) || 0
    }))
  });
};

export const createCategory = async (req, res) => {
  handleValidation(req, res);

  const category = await Category.create({
    user: req.user._id,
    name: req.body.name,
    type: req.body.type,
    icon: req.body.icon,
    color: req.body.color
  });

  res.status(201).json({ success: true, data: category });
};

export const updateCategory = async (req, res) => {
  handleValidation(req, res);

  const category = await Category.findOne({ _id: req.params.id, user: req.user._id, isDefault: false });
  if (!category) {
    return res.status(404).json({ success: false, message: "Custom category not found" });
  }

  Object.assign(category, req.body);
  await category.save();

  res.json({ success: true, data: category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id, isDefault: false });
  if (!category) {
    return res.status(404).json({ success: false, message: "Custom category not found" });
  }

  const [transactionCount, budgetCount] = await Promise.all([
    Transaction.countDocuments({ user: req.user._id, category: category._id }),
    Budget.countDocuments({ user: req.user._id, category: category._id })
  ]);

  if (transactionCount > 0 || budgetCount > 0) {
    return res.status(400).json({ success: false, message: "Category is in use and cannot be deleted" });
  }

  await category.deleteOne();
  res.json({ success: true, message: "Category deleted successfully" });
};
