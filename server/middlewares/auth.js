const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = process.env;

module.exports = async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, error: "No token provided" });
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ success: false, error: "Malformed token" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user)
      return res.status(401).json({ success: false, error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};
