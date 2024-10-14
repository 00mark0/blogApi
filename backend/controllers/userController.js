import {
  createUser,
  findUserByUsername,
  findUserByEmail,
  updateUserFailedAttempts,
  lockUserAccount,
  resetFailedAttempts,
  getAllUsers,
  deleteUserAdmin,
  deleteOwnAccount,
  updateUserDetails,
  getUser,
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
    const existingUser = await findUserByUsername(username);
    const existingEmail = await findUserByEmail(email);

    if (existingUser || existingEmail) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const user = await createUser(username, password, email, isAdmin);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res, isAdminLogin) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (user.is_locked || user.username.startsWith("deleted_")) {
      return res.status(403).json({
        error: "Account is locked or has been deleted",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const failedAttempts = user.failed_attempts + 1;
      await updateUserFailedAttempts(username, failedAttempts);

      if (failedAttempts >= 5) {
        await lockUserAccount(username);
        return res.status(403).json({
          error: "Account is locked due to multiple failed login attempts",
        });
      }

      return res.status(401).json({ error: "Invalid credentials" });
    }

    await resetFailedAttempts(username);

    // Check if the login attempt is for an admin
    if (isAdminLogin && !user.is_admin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsersList = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteUserAdmin(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOwnAccountController = async (req, res) => {
  const userId = req.user.id;

  try {
    await deleteOwnAccount(userId);
    res.json({ message: "Your account has been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserDetailsController = async (req, res) => {
  const userId = req.user.id;
  const { newUsername, newEmail } = req.body;

  try {
    const existingUser = await findUserByUsername(newUsername);
    const existingEmail = await findUserByEmail(newEmail);

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (existingEmail && existingEmail.id !== userId) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const updatedUser = await updateUserDetails(userId, newUsername, newEmail);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
