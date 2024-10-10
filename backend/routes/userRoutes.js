import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsersList,
  deleteUser,
  deleteOwnAccountController,
  updateUserDetailsController,
} from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Example of a protected route
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// DELETE acc for user
router.delete("/me", authenticateToken, deleteOwnAccountController);

// Update user details
router.put("/me", authenticateToken, updateUserDetailsController);

// Example of an admin-only route
router.get("/admin", authenticateToken, isAdmin, (req, res) => {
  res.json({ message: "This is an admin-only route", user: req.user });
});

// Admin login
router.post("/admin/login", authenticateToken, isAdmin, loginUser);

router.get("/admin/users", authenticateToken, isAdmin, getAllUsersList);

router.delete("/admin/users/:id", authenticateToken, isAdmin, deleteUser);

export default router;
