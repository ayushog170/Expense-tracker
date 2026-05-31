const express = require("express");
const {
  signup,
  login,
  startGoogleAuth,
  handleGoogleCallback,
  getCurrentUser,
  logout,
  getAuthConfig,
  updatePreferences,
} = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/google", startGoogleAuth);
router.get("/google/callback", handleGoogleCallback);
router.get("/config", getAuthConfig);
router.get("/me", requireAuth, getCurrentUser);
router.patch("/preferences", requireAuth, updatePreferences);
router.post("/logout", requireAuth, logout);

module.exports = router;
