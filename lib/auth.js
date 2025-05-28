// lib/auth.js
import jwt from "jsonwebtoken";

export function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    if (!decoded) return null;
    return decoded;
  } catch (err) {
    return null;
  }
}
