import { motion } from "framer-motion";
import { FaEnvelope, FaWallet } from "react-icons/fa";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mt-8 rounded-3xl px-5 py-4"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 font-semibold text-sky-800 dark:text-sky-100">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-400 text-white">
            <FaWallet />
          </span>
          Expense Tracker
        </div>
        <p>Modern personal finance dashboard with secure Google authentication.</p>
        <a
          href="mailto:hemurawat7693@gmail.com"
          className="flex items-center gap-2 rounded-xl bg-sky-500/10 px-3 py-2 font-medium text-sky-800 transition hover:bg-sky-600 hover:text-white dark:text-sky-100"
        >
          <FaEnvelope />
          Contact Team
        </a>
      </div>
    </motion.footer>
  );
}

export default Footer;
