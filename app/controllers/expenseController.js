const Expense = require("../models/Expense");
const { predictCategory } = require("../ml/model");
const { expenses: memoryExpenses, createId } = require("../config/memoryStore");

const validCategories = ["Food", "Travel", "Bills", "Shopping", "Others"];
const isMemoryMode = () => process.env.USE_IN_MEMORY === "true";
const defaultBalanceLimit = 1000;

function buildSummary(items) {
  const totals = items.reduce(
    (acc, item) => {
      if (item.type === "income") acc.totalIncome += Number(item.amount);
      else acc.totalExpenses += Number(item.amount);
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  return {
    ...totals,
    balance: totals.totalIncome - totals.totalExpenses,
  };
}

async function getUserExpenses(userId) {
  return isMemoryMode()
    ? memoryExpenses.filter((item) => String(item.user) === userId)
    : await Expense.find({ user: userId });
}

function getBalanceLimit(req) {
  return Number(req.user?.balanceLimit ?? defaultBalanceLimit);
}

function wouldBreakBalanceLimit(items, nextExpenseAmount, balanceLimit, existingExpenseAmount = 0) {
  const summary = buildSummary(items);
  const nextBalance =
    summary.balance + Number(existingExpenseAmount || 0) - Number(nextExpenseAmount || 0);
  return nextBalance <= Number(balanceLimit);
}

function balanceLimitMessage(balanceLimit) {
  return `The limit for your balance is ${balanceLimit}. You are spending too much, so this expense entry was blocked.`;
}

exports.getExpenses = async (req, res) => {
  try {
    if (isMemoryMode()) {
      const items = memoryExpenses
        .filter((item) => String(item.user) === req.userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json(items);
    }
    const items = await Expense.find({ user: req.userId }).sort({ date: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

exports.createExpense = async (req, res) => {
  try {
    let { amount, category, description, date, type } = req.body;
    if (!amount || !description || !date) {
      return res.status(400).json({ message: "amount, description, and date are required" });
    }

    if (!category) category = predictCategory(description);
    if (!validCategories.includes(category)) category = "Others";
    if (!["income", "expense"].includes(type)) type = "expense";

    if (type === "expense") {
      const userExpenses = await getUserExpenses(req.userId);
      const balanceLimit = getBalanceLimit(req);
      if (wouldBreakBalanceLimit(userExpenses, amount, balanceLimit)) {
        return res.status(400).json({
          message: balanceLimitMessage(balanceLimit),
        });
      }
    }

    if (isMemoryMode()) {
      const item = {
        _id: createId(),
        amount: Number(amount),
        category,
        description,
        date,
        type,
        user: req.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryExpenses.push(item);
      return res.status(201).json(item);
    }

    const item = await Expense.create({
      amount: Number(amount),
      category,
      description,
      date,
      type,
      user: req.userId,
    });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create expense", error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const payload = req.body;
    if (payload.category && !validCategories.includes(payload.category)) {
      payload.category = "Others";
    }

    if (isMemoryMode()) {
      const index = memoryExpenses.findIndex(
        (item) => item._id === req.params.id && String(item.user) === req.userId
      );
      if (index === -1) return res.status(404).json({ message: "Expense not found" });
      const nextType = payload.type || memoryExpenses[index].type;
      const nextAmount =
        payload.amount === undefined ? memoryExpenses[index].amount : Number(payload.amount);
      if (nextType === "expense") {
        const userExpenses = await getUserExpenses(req.userId);
        const balanceLimit = getBalanceLimit(req);
        const existingExpenseAmount =
          memoryExpenses[index].type === "expense" ? memoryExpenses[index].amount : 0;
        if (wouldBreakBalanceLimit(userExpenses, nextAmount, balanceLimit, existingExpenseAmount)) {
          return res.status(400).json({
            message: balanceLimitMessage(balanceLimit),
          });
        }
      }
      memoryExpenses[index] = {
        ...memoryExpenses[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      return res.json(memoryExpenses[index]);
    }

    const existingItem = await Expense.findOne({ _id: req.params.id, user: req.userId });
    if (!existingItem) return res.status(404).json({ message: "Expense not found" });

    const nextType = payload.type || existingItem.type;
    const nextAmount = payload.amount === undefined ? existingItem.amount : Number(payload.amount);
    if (nextType === "expense") {
      const userExpenses = await getUserExpenses(req.userId);
      const balanceLimit = getBalanceLimit(req);
      const existingExpenseAmount = existingItem.type === "expense" ? existingItem.amount : 0;
      if (wouldBreakBalanceLimit(userExpenses, nextAmount, balanceLimit, existingExpenseAmount)) {
        return res.status(400).json({
          message: balanceLimitMessage(balanceLimit),
        });
      }
    }

    const item = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.userId }, payload, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Expense not found" });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update expense" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    if (isMemoryMode()) {
      const index = memoryExpenses.findIndex(
        (item) => item._id === req.params.id && String(item.user) === req.userId
      );
      if (index === -1) return res.status(404).json({ message: "Expense not found" });
      memoryExpenses.splice(index, 1);
      return res.json({ message: "Deleted successfully" });
    }

    const item = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ message: "Expense not found" });
    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete expense" });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const items = await getUserExpenses(req.userId);
    return res.json(buildSummary(items));
  } catch (error) {
    return res.status(500).json({ message: "Failed to build summary" });
  }
};
