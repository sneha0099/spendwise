import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import Category from "../models/Category.js";
import generateToken from "../utils/generateToken.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
};

export const registerUser = async (req, res) => {
  handleValidation(req, res);

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email }
  });
};

export const loginUser = async (req, res) => {
  handleValidation(req, res);

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar
      }
    }
  });
};

export const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

export const updateProfile = async (req, res) => {
  handleValidation(req, res);

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.currency = req.body.currency || user.currency;
  user.avatar = req.body.avatar ?? user.avatar;
  await user.save();

  res.json({ success: true, data: user });
};

export const changePassword = async (req, res) => {
  handleValidation(req, res);

  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ success: false, message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
};

export const deleteAccount = async (req, res) => {
  await Promise.all([
    Transaction.deleteMany({ user: req.user._id }),
    Budget.deleteMany({ user: req.user._id }),
    Category.deleteMany({ user: req.user._id }),
    User.findByIdAndDelete(req.user._id)
  ]);

  res.json({ success: true, message: "Account deleted successfully" });
};
