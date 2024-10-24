import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../models/Article.js";
import {
  deleteCommentsByArticleId,
  deleteLikesByArticleId,
  deleteLikesByCommentId,
} from "../models/Comment.js";

export const createNewArticle = async (req, res) => {
  const userId = req.user.id; // Get userId from JWT token
  const { title, content } = req.body;

  // Validate title and content
  if (!title || !content) {
    console.log("Validation failed: Title and content are required");
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const article = await createArticle(userId, title, content);
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await getArticles();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await getArticleById(id);
    if (!article) {
      console.log("Article not found:", id);
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateExistingArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validate title and content
  if (!title || !content) {
    console.log("Validation failed: Title and content are required");
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const article = await updateArticle(id, title, content);
    if (!article) {
      console.log("Article not found:", id);
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteExistingArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await getArticleById(id);
    if (!article) {
      console.log("Article not found:", id);
      return res.status(404).json({ error: "Article not found" });
    }

    // Delete related likes for comments
    await deleteLikesByCommentId(id);

    // Delete related comments
    await deleteCommentsByArticleId(id);

    // Delete related likes for the article
    await deleteLikesByArticleId(id);

    // Delete the article
    await deleteArticle(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: error.message });
  }
};
