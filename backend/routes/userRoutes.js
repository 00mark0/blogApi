import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Example of a protected route
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Example of an admin-only route
router.get("/admin", authenticateToken, isAdmin, (req, res) => {
  res.json({ message: "This is an admin-only route", user: req.user });
});

export default router;
