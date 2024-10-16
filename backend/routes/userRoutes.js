import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsersList,
  deleteUser,
  deleteOwnAccountController,
  updateUserDetailsController,
  getUserDetails,
  loginAdmin,
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

// Get user details
router.get("/:id", authenticateToken, getUserDetails);

// Admin login
router.post("/admin/login", loginAdmin);

router.get("/admin/users", authenticateToken, isAdmin, getAllUsersList);

router.delete("/admin/users/:id", authenticateToken, isAdmin, deleteUser);

export default router;
