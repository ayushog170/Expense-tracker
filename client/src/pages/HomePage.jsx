import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaCalendarAlt, FaChartLine, FaReceipt } from "react-icons/fa";
import PageShell from "../components/PageShell";
import { expenseService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function HomePage() {
  const { logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    expenseService
      .getAll()
      .then(({ data }) => setExpenses(data))
      .catch(async (error) => {
        if (error.response?.status === 401) await logout();
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const monthGroups = useMemo(() => {
    const groups = {};
    expenses
      .filter((item) => item.type !== "income")
      .forEach((item) => {
        const date = new Date(item.date);
        const key = date.toLocaleString("en-US", { month: "long", year: "numeric" });
        if (!groups[key]) groups[key] = { month: key, total: 0, count: 0, items: [] };
        groups[key].total += Number(item.amount || 0);
        groups[key].count += 1;
        groups[key].items.push(item);
      });

    return Object.values(groups).sort(
      (a, b) => new Date(b.items[0].date) - new Date(a.items[0].date)
    );
  }, [expenses]);

  return (
    <PageShell>
      <section className="mb-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-200"
        >
          Welcome back
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl"
        >
          Choose where you want to start.
        </motion.h1>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          className="glass group flex min-h-[420px] flex-col justify-between rounded-3xl p-7 transition hover:shadow-2xl hover:shadow-sky-500/25"
        >
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-400 text-2xl text-white shadow-xl shadow-sky-500/25">
              <FaChartLine />
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Start tracking your expense
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              Open the main dashboard to add income, record expenses, edit transactions, and review your analytics with charts.
            </p>
          </div>
          <Link
            to="/tracker"
            className="blue-button mt-8 inline-flex w-fit items-center gap-2"
          >
            Open Tracker
            <FaArrowRight className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          className="glass flex min-h-[420px] flex-col rounded-3xl p-7 transition hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl text-white shadow-xl shadow-cyan-500/25">
                <FaCalendarAlt />
              </div>
              <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Past month expenses
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Month-wise expense history from your saved transactions.
              </p>
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-3 overflow-hidden">
            {loading ? (
              <div className="grid h-40 place-items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-10 w-10 rounded-full border-4 border-sky-200 border-t-sky-600"
                />
              </div>
            ) : monthGroups.length ? (
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {monthGroups.map((group, index) => (
                  <motion.div
                    key={group.month}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-2xl border border-white/50 bg-white/55 p-4 shadow-sm backdrop-blur-xl transition hover:bg-sky-50/80 dark:border-slate-700/70 dark:bg-slate-900/55 dark:hover:bg-sky-950/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-200">
                          <FaReceipt />
                        </span>
                        <div>
                          <p className="font-bold text-slate-950 dark:text-white">{group.month}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {group.count} expense{group.count === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-blue-600 dark:text-blue-300">
                        {formatINR(group.total)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-sky-200 bg-white/45 p-5 text-sm text-slate-600 dark:border-sky-900 dark:bg-slate-900/45 dark:text-slate-300">
                No previous expense data yet. Add your first transaction from the tracker.
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}

export default HomePage;
