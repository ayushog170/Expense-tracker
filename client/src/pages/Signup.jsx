import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <h1 className="mb-4 text-2xl font-bold">Signup</h1>
        {error && <p className="mb-2 text-sm text-rose-500">{error}</p>}
        <input
          type="text"
          required
          placeholder="Full Name"
          className="mb-3 w-full rounded-lg border p-2 dark:bg-slate-800"
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="mb-3 w-full rounded-lg border p-2 dark:bg-slate-800"
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        />
        <input
          type="password"
          required
          placeholder="Password (min 6)"
          className="mb-3 w-full rounded-lg border p-2 dark:bg-slate-800"
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        />
        <button className="w-full rounded-lg bg-brand-600 py-2 text-white">Create Account</button>
        <p className="mt-3 text-sm">
          Already registered? <Link to="/login" className="text-brand-600">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;
