import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

const recalculateBudgetSpent = async ({ userId, categoryId, date }) => {
  const txDate = new Date(date);
  const month = txDate.getMonth() + 1;
  const year = txDate.getFullYear();

  const budget = await Budget.findOne({
    user: userId,
    category: categoryId,
    month,
    year
  });

  if (!budget) {
    return null;
  }

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: budget.user,
        category: budget.category,
        type: "expense",
        date: { $gte: monthStart, $lt: monthEnd }
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  budget.spent = result[0]?.total || 0;
  await budget.save();
  return budget;
};

export default recalculateBudgetSpent;
