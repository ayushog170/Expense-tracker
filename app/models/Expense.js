const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Food", "Travel", "Bills", "Shopping", "Others"],
      default: "Others",
    },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["income", "expense"], default: "expense" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
