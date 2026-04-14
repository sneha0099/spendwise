import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank transfer", "other"],
      default: "other"
    },
    tags: [{ type: String }],
    isRecurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: ["daily", "weekly", "monthly", null],
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
