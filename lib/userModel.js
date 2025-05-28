import mongoose from "mongoose";
import { type } from "os";
const userModel = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.users || mongoose.model("users", userModel);
module.exports = User;