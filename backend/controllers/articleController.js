import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../models/Article.js";
import { deleteLikesByArticleId } from "../models/Like.js"; // Import the function to delete likes

export const createNewArticle = async (req, res) => {
  const userId = req.user.id; // Get userId from JWT token
  const { title, content } = req.body;

  // Validate title and content
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const article = await createArticle(userId, title, content);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await getArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExistingArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validate title and content
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const article = await updateArticle(id, title, content);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExistingArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Delete related likes
    await deleteLikesByArticleId(id);

    await deleteArticle(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
