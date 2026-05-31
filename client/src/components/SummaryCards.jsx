import { motion } from "framer-motion";
import { FaArrowDown, FaArrowUp, FaBalanceScale } from "react-icons/fa";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const icons = {
  income: FaArrowUp,
  expense: FaArrowDown,
  balance: FaBalanceScale,
};

function Card({ label, amount, color, type, delay }) {
  const Icon = icons[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass group relative overflow-hidden rounded-3xl p-5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className={`mt-2 text-2xl font-black tracking-tight ${color}`}>{formatINR(amount)}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white dark:text-sky-200">
          <Icon />
        </span>
      </div>
    </motion.div>
  );
}

function SummaryCards({ summary }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card label="Total Income" amount={summary.totalIncome} color="text-emerald-500" type="income" delay={0.05} />
      <Card
        label="Total Expenses"
        amount={summary.totalExpenses}
        color="text-rose-500"
        type="expense"
        delay={0.1}
      />
      <Card label="Balance" amount={summary.balance} color="text-sky-600 dark:text-sky-200" type="balance" delay={0.15} />
    </div>
  );
}

export default SummaryCards;
