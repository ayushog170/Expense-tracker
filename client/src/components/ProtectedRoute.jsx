import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
            <FaWallet />
          </span>
          <div>
            <p className="text-sm font-semibold">Securing your dashboard</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Checking your Google session...</p>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
