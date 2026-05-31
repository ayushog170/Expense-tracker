import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import SummaryCards from "../components/SummaryCards";
import ChartsPanel from "../components/ChartsPanel";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import { expenseService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout, updatePreferences } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const [limitInput, setLimitInput] = useState(String(user?.balanceLimit ?? 1000));
  const [savingLimit, setSavingLimit] = useState(false);

  const balanceLimit = Number(user?.balanceLimit ?? 1000);

  useEffect(() => {
    setLimitInput(String(user?.balanceLimit ?? 1000));
  }, [user?.balanceLimit]);

  const fetchData = async () => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        expenseService.getAll(),
        expenseService.summary(),
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      if (error.response?.status === 401) await logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (form) => {
    try {
      setWarning("");
      const amount = Number(form.amount || 0);
      const existingExpenseAmount =
        editingItem?.type === "expense" ? Number(editingItem.amount || 0) : 0;
      const nextBalance =
        form.type === "expense" ? summary.balance + existingExpenseAmount - amount : summary.balance;

      if (form.type === "expense" && nextBalance <= balanceLimit) {
        setWarning(
          `The limit for your balance is ${balanceLimit}. You are spending too much, so this expense entry was blocked.`
        );
        return;
      }

      if (editingItem) {
        await expenseService.update(editingItem._id, form);
        setEditingItem(null);
      } else {
        await expenseService.create(form);
      }
      await fetchData();
    } catch (error) {
      setWarning(error.response?.data?.message || "Could not save this entry. Please try again.");
    }
  };

  const handleLimitSave = async (e) => {
    e.preventDefault();
    const nextLimit = Number(limitInput);
    if (!Number.isFinite(nextLimit) || nextLimit < 0) {
      setWarning("Please enter a valid balance limit.");
      return;
    }

    try {
      setSavingLimit(true);
      setWarning("");
      await updatePreferences({ balanceLimit: nextLimit });
    } catch (error) {
      setWarning(error.response?.data?.message || "Could not update balance limit.");
    } finally {
      setSavingLimit(false);
    }
  };

  const handleDelete = async (id) => {
    await expenseService.remove(id);
    await fetchData();
  };

  const categoryData = useMemo(() => {
    const agg = {};
    expenses
      .filter((x) => x.type === "expense")
      .forEach((item) => {
        const amount = Number(item.amount);
        if (!Number.isFinite(amount) || amount <= 0) return;
        const category = item.category || "Others";
        agg[category] = (agg[category] || 0) + amount;
      });
    return Object.entries(agg)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const map = {};
    expenses.forEach((item) => {
      const month = new Date(item.date).toLocaleString("en-US", { month: "short" });
      if (!map[month]) map[month] = { month, income: 0, expense: 0 };
      map[month][item.type] += Number(item.amount);
    });
    return Object.values(map);
  }, [expenses]);

  return (
    <PageShell>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
            Smart finance workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Track money with a cleaner, faster dashboard.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Add income and expenses, review spending patterns, and keep your personal analytics protected behind Google sign-in.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">Current balance</p>
          <p className="mt-2 text-4xl font-black text-sky-700 dark:text-sky-200">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(Number(summary.balance || 0))}
          </p>
          <form onSubmit={handleLimitSave} className="mt-5 rounded-2xl border border-white/60 bg-white/55 p-3 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/55">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Balance limit
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="blue-input min-w-0 flex-1"
              />
              <button
                type="submit"
                disabled={savingLimit}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingLimit ? "Saving" : "Set"}
              </button>
            </div>
          </form>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              className="h-full rounded-full bg-gradient-to-r from-sky-600 to-cyan-400"
            />
          </div>
        </motion.div>
      </section>

      {loading ? (
        <div className="glass grid min-h-64 place-items-center rounded-3xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-sky-200 border-t-sky-600"
          />
        </div>
      ) : (
        <div className="space-y-5">
          <SummaryCards summary={summary} />
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-amber-200 bg-amber-50/85 p-4 text-sm font-semibold text-amber-800 shadow-lg shadow-amber-500/10 backdrop-blur-xl dark:border-amber-900/70 dark:bg-amber-950/60 dark:text-amber-200"
            >
              {warning}
            </motion.div>
          )}
          <ChartsPanel categoryData={categoryData} monthlyData={monthlyData} />
          <ExpenseForm
            onSubmit={handleSubmit}
            editingItem={editingItem}
            cancelEdit={() => setEditingItem(null)}
          />
          <ExpenseTable items={expenses} onEdit={setEditingItem} onDelete={handleDelete} />
        </div>
      )}
    </PageShell>
  );
}

export default Dashboard;
