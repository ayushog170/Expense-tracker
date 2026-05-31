import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.login(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        {error && <p className="mb-2 text-sm text-rose-500">{error}</p>}
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
          placeholder="Password"
          className="mb-3 w-full rounded-lg border p-2 dark:bg-slate-800"
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        />
        <button className="w-full rounded-lg bg-brand-600 py-2 text-white">Login</button>
        <p className="mt-3 text-sm">
          No account? <Link to="/signup" className="text-brand-600">Signup</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
