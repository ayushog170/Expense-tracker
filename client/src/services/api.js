import axios from "axios";

export const api = axios.create({
  baseURL: "https://expense-tracker-backend-e6x6.onrender.com",
  withCredentials: true,
});

export const authService = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  config: () => api.get("/auth/config"),
  updatePreferences: (payload) => api.patch("/auth/preferences", payload),
  logout: () => api.post("/auth/logout"),
  googleUrl: () => "https://expense-tracker-backend-e6x6.onrender.com/auth/google",
};

export const expenseService = {
  getAll: () => api.get("/expenses"),
  create: (payload) => api.post("/expenses", payload),
  update: (id, payload) => api.put(`/expenses/${id}`, payload),
  remove: (id) => api.delete(`/expenses/${id}`),
  summary: () => api.get("/summary"),
  predictCategory: (description) => api.post("/predict-category", { description }),
};
