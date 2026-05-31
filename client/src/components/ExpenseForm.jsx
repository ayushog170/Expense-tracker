import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { expenseService } from "../services/api";

const categories = ["Food", "Travel", "Bills", "Shopping", "Others"];

const emptyForm = {
  amount: "",
  category: "Others",
  description: "",
  date: "",
  type: "expense",
};

function ExpenseForm({ onSubmit, editingItem, cancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        amount: editingItem.amount,
        category: editingItem.category,
        description: editingItem.description,
        date: editingItem.date?.slice(0, 10),
        type: editingItem.type || "expense",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingItem]);

  const handlePredict = async () => {
    // Only auto-predict when user hasn't chosen a category yet
    if (!form.description?.trim()) return;
    if (editingItem) return;
    if (form.category && form.category !== "Others") return;
    try {
      setPredicting(true);
      const { data } = await expenseService.predictCategory(form.description);
      setForm((prev) => ({ ...prev, category: data.category || prev.category }));
    } catch (error) {
      console.error("Prediction failed:", error.message);
    } finally {
      setPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      category: form.type === "income" ? "Others" : form.category,
    });
    setForm(emptyForm);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onSubmit={handleSubmit}
      className="glass rounded-3xl p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {editingItem ? "Edit Entry" : "Add New Entry"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Capture transactions and let smart category prediction help.</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
          className="blue-input"
        />
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          className="blue-input"
        />
        <div className="rounded-2xl border border-slate-200 bg-white/75 p-2 dark:border-slate-700 dark:bg-slate-900/70">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Entry Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["expense", "income"].map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold capitalize transition ${
                  form.type === type
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-sky-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-950/50"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={form.type === type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                      category: e.target.value === "income" ? "Others" : prev.category,
                    }))
                  }
                  className="sr-only"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <select
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          disabled={form.type === "income"}
          className="blue-input disabled:cursor-not-allowed disabled:opacity-50"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="md:col-span-2">
          <textarea
            required
            rows="3"
            placeholder="Description"
            value={form.description}
            onBlur={handlePredict}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="blue-input w-full"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {predicting
              ? "Predicting category..."
              : "Category autofills from built-in ML when description is entered."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="blue-button">
          {editingItem ? "Update" : "Save"}
        </motion.button>
        {editingItem && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={cancelEdit}
            className="rounded-xl bg-slate-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-700"
          >
            Cancel
          </motion.button>
        )}
      </div>
    </motion.form>
  );
}

export default ExpenseForm;
