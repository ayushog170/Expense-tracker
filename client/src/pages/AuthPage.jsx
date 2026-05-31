import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartLine, FaLock, FaMoon, FaSun, FaWallet } from "react-icons/fa";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import Footer from "../components/Footer";

function AuthPage({ callback = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, loginWithGoogle, refreshUser } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [startingLogin, setStartingLogin] = useState(false);
  const [googleConfigured, setGoogleConfigured] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const error = searchParams.get("error");

  const from = location.state?.from?.pathname || "/home";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!callback) return;
    refreshUser().then((currentUser) => {
      navigate(currentUser ? "/home" : "/auth", { replace: true });
    });
  }, [callback, navigate, refreshUser]);

  useEffect(() => {
    if (callback) return;
    authService
      .config()
      .then(({ data }) => setGoogleConfigured(Boolean(data.googleConfigured)))
      .catch(() => setGoogleConfigured(false))
      .finally(() => setConfigLoading(false));
  }, [callback]);

  if (!callback && !loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleLogin = () => {
    setStartingLogin(true);
    loginWithGoogle();
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 bg-sky-950/25 backdrop-blur-[2px] dark:bg-slate-950/60" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(240,249,255,0.82),rgba(14,165,233,0.28),rgba(8,47,73,0.45))] dark:bg-[linear-gradient(135deg,rgba(2,6,23,0.88),rgba(8,47,73,0.62),rgba(14,116,144,0.34))]" />
      <div className="absolute inset-x-0 top-0 h-36 border-b border-white/40 bg-white/30 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/25" />
      <div className="absolute inset-x-0 bottom-0 h-40 border-t border-white/40 bg-slate-50/30 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/25" />

      <button
        type="button"
        onClick={() => setDarkMode((prev) => !prev)}
        className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl transition hover:scale-105 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
        aria-label="Toggle theme"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <section className="relative z-10 mx-auto flex w-full flex-1 max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass w-full rounded-3xl p-6 shadow-2xl shadow-slate-300/40 dark:shadow-black/30 sm:p-8"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ rotate: -8, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 14 }}
              className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-2xl text-white shadow-lg shadow-brand-600/30"
            >
              <FaWallet />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Expense Tracker</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Sign in with Google to manage spending, income, and insights from one secure dashboard.
            </p>
          </div>

          {callback ? (
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Finishing Google sign-in...
            </div>
          ) : (
            <>
              {(error || !googleConfigured) && !configLoading && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  {error || "Add your Google OAuth Client ID and Secret in app/.env, then restart npm run dev."}
                </motion.p>
              )}
              <GoogleLoginButton
                onClick={handleGoogleLogin}
                loading={startingLogin || loading || configLoading}
                disabled={!googleConfigured}
              />
            </>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="rounded-2xl border border-white/60 bg-white/45 p-3 dark:border-slate-700/70 dark:bg-slate-900/45">
              <FaLock className="mb-2 text-brand-600 dark:text-brand-50" />
              Secure session
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/45 p-3 dark:border-slate-700/70 dark:bg-slate-900/45">
              <FaChartLine className="mb-2 text-emerald-500" />
              Private analytics
            </div>
          </div>
        </motion.div>
      </section>
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Footer />
      </div>
    </main>
  );
}

export default AuthPage;
