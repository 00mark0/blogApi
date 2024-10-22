import express from "express";
import {
  createNewComment,
  getComments,
  updateExistingComment,
  deleteExistingComment,
  deleteExistingCommentAdmin,
  getCommentsOfUser,
} from "../controllers/commentController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST a new comment, with the articleId as a path parameter
router.post("/:articleId", authenticateToken, createNewComment);

// GET comments for a specific article
router.get("/:articleId", getComments);

// GET comments for a specific user
router.get("/user/:userId", getCommentsOfUser);

// PUT (update) a comment by comment id
router.put("/:id", authenticateToken, updateExistingComment);

// DELETE a comment by comment id
router.delete("/:id", authenticateToken, deleteExistingComment);

// DELETE a comment by comment id (admin only)
router.delete(
  "/admin/:id",
  authenticateToken,
  isAdmin,
  deleteExistingCommentAdmin
);

export default router;
