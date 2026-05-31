import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

function GoogleLoginButton({ onClick, loading, disabled }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-500"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-50 transition group-hover:scale-105 dark:bg-slate-800">
        <FcGoogle className="text-xl" />
      </span>
      {loading ? "Opening Google..." : "Continue with Google"}
    </motion.button>
  );
}

export default GoogleLoginButton;
