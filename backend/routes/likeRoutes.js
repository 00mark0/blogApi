import express from "express";
import {
  likeOrDislikeArticle,
  likeOrDislikeComment,
} from "../controllers/likeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST to like or dislike an article (articleId in path)
router.post("/article/:articleId", authenticateToken, likeOrDislikeArticle);

// POST to like or dislike a comment (commentId in path)
router.post("/comment/:commentId", authenticateToken, likeOrDislikeComment);

export default router;
