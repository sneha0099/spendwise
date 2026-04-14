import { validationResult } from "express-validator";
import multer from "multer";
import { Parser } from "json2csv";
import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import recalculateBudgetSpent from "../utils/recalculateBudgetSpent.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
};

const buildQuery = (userId, query) => {
  const filters = { user: userId };

  if (query.type) filters.type = query.type;
  if (query.category) filters.category = { $in: String(query.category).split(",") };
  if (query.search) filters.description = { $regex: query.search, $options: "i" };
  if (query.paymentMethod) filters.paymentMethod = query.paymentMethod;

  if (query.month && query.year) {
    const month = Number(query.month);
    const year = Number(query.year);
    filters.date = { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) };
  }

  if (query.startDate || query.endDate) {
    filters.date = filters.date || {};
    if (query.startDate) filters.date.$gte = new Date(query.startDate);
    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filters.date.$lte = endDate;
    }
  }

  return filters;
};

const populateTransaction = (id) => Transaction.findById(id).populate("category", "name icon color type");

export const upload = multer({ storage: multer.memoryStorage() });

export const getTransactions = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "date";
  const order = req.query.order === "asc" ? 1 : -1;
  const query = buildQuery(req.user._id, req.query);

  const [items, total] = await Promise.all([
    Transaction.find(query)
      .populate("category", "name icon color type")
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
  });
};

export const getTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id }).populate(
    "category",
    "name icon color type"
  );

  if (!transaction) {
    return res.status(404).json({ success: false, message: "Transaction not found" });
  }

  res.json({ success: true, data: transaction });
};

export const createTransaction = async (req, res) => {
  handleValidation(req, res);

  const category = await Category.findOne({
    _id: req.body.category,
    $or: [{ isDefault: true }, { user: req.user._id }]
  });

  if (!category || (category.type !== "both" && category.type !== req.body.type)) {
    return res.status(400).json({ success: false, message: "Select a valid category" });
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    type: req.body.type,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description || "",
    date: req.body.date,
    paymentMethod: req.body.paymentMethod || "other",
    tags: Array.isArray(req.body.tags)
      ? req.body.tags
      : String(req.body.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    isRecurring: req.body.isRecurring || false,
    recurringInterval: req.body.isRecurring ? req.body.recurringInterval : null
  });

  if (transaction.type === "expense") {
    await recalculateBudgetSpent({
      userId: req.user._id,
      categoryId: transaction.category,
      date: transaction.date
    });
  }

  res.status(201).json({ success: true, data: await populateTransaction(transaction._id) });
};

export const updateTransaction = async (req, res) => {
  handleValidation(req, res);

  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) {
    return res.status(404).json({ success: false, message: "Transaction not found" });
  }

  const previous = { type: transaction.type, category: transaction.category, date: transaction.date };

  Object.assign(transaction, {
    type: req.body.type,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description || "",
    date: req.body.date,
    paymentMethod: req.body.paymentMethod || "other",
    tags: Array.isArray(req.body.tags)
      ? req.body.tags
      : String(req.body.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    isRecurring: req.body.isRecurring || false,
    recurringInterval: req.body.isRecurring ? req.body.recurringInterval : null
  });

  await transaction.save();

  if (previous.type === "expense") {
    await recalculateBudgetSpent({ userId: req.user._id, categoryId: previous.category, date: previous.date });
  }
  if (transaction.type === "expense") {
    await recalculateBudgetSpent({ userId: req.user._id, categoryId: transaction.category, date: transaction.date });
  }

  res.json({ success: true, data: await populateTransaction(transaction._id) });
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) {
    return res.status(404).json({ success: false, message: "Transaction not found" });
  }

  const snapshot = { type: transaction.type, category: transaction.category, date: transaction.date };
  await transaction.deleteOne();

  if (snapshot.type === "expense") {
    await recalculateBudgetSpent({ userId: req.user._id, categoryId: snapshot.category, date: snapshot.date });
  }

  res.json({ success: true, message: "Transaction deleted successfully" });
};

export const getSummary = async (req, res) => {
  const query = buildQuery(req.user._id, req.query);
  const transactions = await Transaction.find(query).populate("category", "name").sort({ date: 1 });

  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") acc.income += transaction.amount;
      if (transaction.type === "expense") acc.expense += transaction.amount;
      acc.balance = acc.income - acc.expense;
      acc.trend.push({ date: transaction.date, balance: acc.balance });
      return acc;
    },
    { income: 0, expense: 0, balance: 0, trend: [] }
  );

  summary.savingsRate = summary.income ? Number(((summary.balance / summary.income) * 100).toFixed(2)) : 0;
  res.json({ success: true, data: summary });
};

export const exportTransactionsCsv = async (req, res) => {
  const query = buildQuery(req.user._id, req.query);
  const transactions = await Transaction.find(query).populate("category", "name").sort({ date: -1 });
  const parser = new Parser({
    fields: ["Date", "Type", "Category", "Description", "Payment Method", "Amount", "Tags"]
  });

  const csv = parser.parse(
    transactions.map((transaction) => ({
      Date: transaction.date.toISOString(),
      Type: transaction.type,
      Category: transaction.category?.name || "",
      Description: transaction.description,
      "Payment Method": transaction.paymentMethod,
      Amount: transaction.amount,
      Tags: transaction.tags.join(", ")
    }))
  );

  const dateLabel = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).replace(" ", "_");
  res.header("Content-Type", "text/csv");
  res.attachment(`transactions_${dateLabel.toLowerCase()}.csv`);
  res.send(csv);
};

export const importTransactionsCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "CSV file is required" });
  }

  const csv = req.file.buffer.toString("utf-8").trim();
  const [headerLine, ...lines] = csv.split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim().toLowerCase());
  let imported = 0;
  let skipped = 0;

  for (const line of lines) {
    const values = line.split(",");
    const row = headers.reduce((acc, header, index) => {
      acc[header] = values[index]?.trim() || "";
      return acc;
    }, {});

    try {
      const category = await Category.findOne({
        name: row.category,
        $or: [{ isDefault: true }, { user: req.user._id }]
      });

      if (!category || !["income", "expense"].includes(row.type) || Number.isNaN(Number(row.amount))) {
        skipped += 1;
        continue;
      }

      const transaction = await Transaction.create({
        user: req.user._id,
        type: row.type,
        amount: Number(row.amount),
        category: category._id,
        description: row.description || "",
        date: row.date || new Date(),
        paymentMethod: row["payment method"] || "other",
        tags: row.tags ? row.tags.split("|").map((tag) => tag.trim()).filter(Boolean) : []
      });

      if (transaction.type === "expense") {
        await recalculateBudgetSpent({
          userId: req.user._id,
          categoryId: transaction.category,
          date: transaction.date
        });
      }

      imported += 1;
    } catch (error) {
      skipped += 1;
    }
  }

  res.json({ success: true, data: { imported, skipped } });
};
