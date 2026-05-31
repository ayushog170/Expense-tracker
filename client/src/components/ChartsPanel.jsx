import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#0284c7", "#06b6d4", "#2563eb", "#10b981", "#38bdf8"];

function ChartsPanel({ categoryData, monthlyData }) {
  const hasCategoryData = categoryData.length > 0;
  const pieData = hasCategoryData ? categoryData : [{ name: "No Expenses", value: 1 }];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="glass h-80 rounded-3xl p-5"
      >
        <h3 className="mb-1 text-lg font-bold">Category-wise Expenses</h3>
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Spending split across your categories</p>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={88} innerRadius={48} paddingAngle={4}>
              {pieData.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs. ${Number(value).toFixed(2)}`} contentStyle={{ borderRadius: 16, border: "1px solid #bae6fd" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        whileHover={{ y: -4 }}
        className="glass h-80 rounded-3xl p-5"
      >
        <h3 className="mb-1 text-lg font-bold">Monthly Trend</h3>
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Income and expense movement</p>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bae6fd" opacity={0.45} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #bae6fd" }} />
            <Legend />
            <Bar dataKey="income" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default ChartsPanel;
