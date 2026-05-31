import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBars,
  FaChevronDown,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTimes,
  FaWallet,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Home", to: "/home" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

function NavItem({ link, onClick }) {
  return (
    <NavLink
      to={link.to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-sky-500/15 text-sky-700 shadow-sm dark:text-sky-200"
            : "text-slate-600 hover:bg-white/70 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-sky-200"
        }`
      }
    >
      {link.label}
    </NavLink>
  );
}

function Navbar({ darkMode, setDarkMode, onLogout }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = onLogout || logout;
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass sticky top-3 z-30 mx-auto mb-6 max-w-5xl rounded-2xl px-4 py-3"
    >
      <div className="relative mx-auto flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <NavLink to="/home" className="flex items-center gap-2 text-sky-700 dark:text-sky-100">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-400 text-white shadow-lg shadow-sky-500/25">
              <FaWallet />
            </span>
            <span className="truncate text-base font-bold tracking-tight sm:text-lg">
              Expense Tracker
            </span>
          </NavLink>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavItem key={link.to} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-sky-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:text-sky-200"
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="group relative hidden sm:block">
            <button className="flex h-10 items-center gap-2 rounded-xl bg-white/80 px-2 pr-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/80">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-100 dark:ring-sky-900"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">
                  {initial}
                </span>
              )}
              <span className="hidden max-w-32 truncate font-medium md:block">{user?.name}</span>
              <FaChevronDown className="text-xs text-slate-400" />
            </button>
            <div className="invisible absolute right-0 mt-2 w-64 translate-y-1 rounded-2xl border border-white/50 bg-white p-3 opacity-0 shadow-2xl shadow-sky-950/10 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-700 shadow-sm transition hover:text-sky-700 dark:bg-slate-900/80 dark:text-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 grid gap-2 border-t border-white/50 pt-3 dark:border-slate-800 lg:hidden"
        >
          {links.map((link) => (
            <NavItem key={link.to} link={link} onClick={() => setMenuOpen(false)} />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40 sm:hidden"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </motion.nav>
      )}
    </motion.header>
  );
}

export default Navbar;
