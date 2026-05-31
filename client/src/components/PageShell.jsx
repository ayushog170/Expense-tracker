import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PageShell({ children }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-3 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 bg-sky-950/25 backdrop-blur-[2px] dark:bg-slate-950/60" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(240,249,255,0.82),rgba(14,165,233,0.28),rgba(8,47,73,0.45))] dark:bg-[linear-gradient(135deg,rgba(2,6,23,0.88),rgba(8,47,73,0.62),rgba(14,116,144,0.34))]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 border-b border-white/30 bg-white/20 backdrop-blur-3xl dark:border-slate-800/80 dark:bg-slate-950/20" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
        <Footer />
      </div>
    </main>
  );
}

export default PageShell;
