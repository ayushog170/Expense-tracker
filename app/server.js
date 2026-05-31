const cors = require("cors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const { getSummary } = require("./controllers/expenseController");
const { predictCategoryApi } = require("./controllers/mlController");
const requireAuth = require("./middleware/authMiddleware");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors({
  origin: "https://expense-tracker-frontend-8sq2.onrender.com",
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.get("/summary", requireAuth, getSummary);
app.post("/predict-category", requireAuth, predictCategoryApi);

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

function startServer() {
  app.listen(PORT, () => {
    const mode = process.env.USE_IN_MEMORY === "true" ? "memory mode" : "database mode";
    console.log(`Server running on http://localhost:${PORT} (${mode})`);
  });
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    process.env.USE_IN_MEMORY = "false";
    startServer();
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    console.warn("Falling back to in-memory store for demo mode.");
    process.env.USE_IN_MEMORY = "true";
    startServer();
  });
