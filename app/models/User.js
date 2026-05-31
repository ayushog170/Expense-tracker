const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String, default: "" },
    authProvider: { type: String, enum: ["google"], default: "google" },
    balanceLimit: { type: Number, default: 1000, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
