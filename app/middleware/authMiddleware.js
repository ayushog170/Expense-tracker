const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { users: memoryUsers } = require("../config/memoryStore");

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

module.exports = async (req, res, next) => {
  const cookieToken = getCookie(req, "auth_token");
  const token = cookieToken;

  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET);
    const userId = String(decoded.userId);
    const user =
      process.env.USE_IN_MEMORY === "true"
        ? memoryUsers.find((item) => String(item._id) === userId)
        : await User.findById(userId);

    if (!user) return res.status(401).json({ message: "User session is no longer valid" });

    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired session" });
  }
};
