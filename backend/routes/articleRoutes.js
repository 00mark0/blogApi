import express from "express";
import {
  createNewArticle,
  getAllArticles,
  getArticle,
  updateExistingArticle,
  deleteExistingArticle,
} from "../controllers/articleController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, isAdmin, createNewArticle);
router.get("/", getAllArticles);
router.get("/:id", getArticle);
router.put("/:id", authenticateToken, isAdmin, updateExistingArticle);
router.delete("/:id", authenticateToken, isAdmin, deleteExistingArticle);

export default router;
