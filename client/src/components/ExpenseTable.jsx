import { motion } from "framer-motion";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

function ExpenseTable({ items, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass overflow-hidden rounded-3xl p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Transactions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Recent income and expenses</p>
        </div>
        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-200">
          {items.length} records
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <motion.tr
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                className="border-t border-sky-100/70 transition hover:bg-sky-50/70 dark:border-slate-800 dark:hover:bg-sky-950/20"
              >
                <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    item.type === "income"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-300"
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="max-w-xs truncate p-3">{item.description}</td>
                <td className="p-3">{item.category}</td>
                <td
                  className={`p-3 font-bold ${
                    item.type === "income" ? "text-emerald-500" : "text-blue-500"
                  }`}
                >
                  {formatINR(item.amount)}
                </td>
                <td className="space-x-2 p-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-600 hover:text-white dark:text-sky-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white dark:text-rose-300"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default ExpenseTable;
