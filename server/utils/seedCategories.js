import Category from "../models/Category.js";

const defaultCategories = [
  { name: "Food & Dining", type: "expense", icon: "🍜", color: "#f97316" },
  { name: "Transport", type: "expense", icon: "🚌", color: "#0ea5e9" },
  { name: "Shopping", type: "expense", icon: "🛍️", color: "#ec4899" },
  { name: "Entertainment", type: "expense", icon: "🎬", color: "#8b5cf6" },
  { name: "Health", type: "expense", icon: "💊", color: "#ef4444" },
  { name: "Education", type: "expense", icon: "📚", color: "#14b8a6" },
  { name: "Utilities", type: "expense", icon: "💡", color: "#eab308" },
  { name: "Rent", type: "expense", icon: "🏠", color: "#6366f1" },
  { name: "Others", type: "expense", icon: "📦", color: "#71717a" },
  { name: "Salary", type: "income", icon: "💼", color: "#22c55e" },
  { name: "Freelance", type: "income", icon: "🧑‍💻", color: "#06b6d4" },
  { name: "Business", type: "income", icon: "🏢", color: "#3b82f6" },
  { name: "Investment", type: "income", icon: "📈", color: "#10b981" },
  { name: "Gift", type: "income", icon: "🎁", color: "#f43f5e" },
  { name: "Others", type: "income", icon: "✨", color: "#71717a" }
];

const seedDefaultCategories = async () => {
  const existingCount = await Category.countDocuments({ isDefault: true });
  if (existingCount > 0) {
    return;
  }

  await Category.insertMany(defaultCategories.map((category) => ({ ...category, isDefault: true })));
  console.log("Default categories seeded");
};

export default seedDefaultCategories;
