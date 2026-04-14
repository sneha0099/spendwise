import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["income", "expense", "both"], required: true },
    icon: { type: String, default: "💸" },
    color: { type: String, default: "#71717a" },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

categorySchema.index(
  { user: 1, name: 1, type: 1 },
  { unique: true, partialFilterExpression: { user: { $type: "objectId" } } }
);

export default mongoose.model("Category", categorySchema);
