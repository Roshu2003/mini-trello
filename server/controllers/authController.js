const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

exports.signup = async (req, res) => {
  console.log("Signup request body:", req.body);

  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    console.log("Validation errors:", errs.array());
    return res.status(400).json({ success: false, errors: errs.array() });
  }

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    console.log("Existing user check:", user);

    if (user) {
      console.log("Email already registered:", email);
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed:", passwordHash);

    user = new User({ name, email, passwordHash });
    await user.save();
    console.log("New user saved:", user);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "7d",
    });
    console.log("JWT token generated:", token);

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.login = async (req, res) => {
  console.log("Login request body:", req.body);

  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    console.log("Validation errors:", errs.array());
    return res.status(400).json({ success: false, errors: errs.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("Invalid credentials - user not found");
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Invalid credentials - password mismatch");
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "7d",
    });
    console.log("JWT token generated:", token);

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
