import {
  createUser,
  findUserByUsername,
  updateUserFailedAttempts,
  lockUserAccount,
  resetFailedAttempts,
} from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasNonalphas
  );
};

export const registerUser = async (req, res) => {
  const { username, password, confirmPassword, email, isAdmin } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ error: "Password does not meet complexity requirements" });
  }

  try {
    const user = await createUser(username, password, email, isAdmin);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    if (user.is_locked) {
      return res
        .status(403)
        .json({
          error: "Account is locked due to multiple failed login attempts",
        });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      await resetFailedAttempts(username);
      const token = jwt.sign(
        { id: user.id, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      const failedAttempts = user.failed_attempts + 1;
      await updateUserFailedAttempts(username, failedAttempts);

      if (failedAttempts >= 5) {
        await lockUserAccount(username);
        return res
          .status(403)
          .json({
            error: "Account is locked due to multiple failed login attempts",
          });
      }

      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
