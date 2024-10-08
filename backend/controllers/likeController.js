import { likeArticle, likeComment } from "../models/Like.js";

// Like or dislike an article
export const likeOrDislikeArticle = async (req, res) => {
  const { articleId } = req.params; // Extract articleId from the path
  const { isLike } = req.body; // Whether it's a like or dislike

  try {
    const userId = req.user.id; // Extract userId from the JWT token

    const like = await likeArticle(userId, articleId, isLike);
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like or dislike a comment
export const likeOrDislikeComment = async (req, res) => {
  const { commentId } = req.params; // Extract commentId from the path
  const { isLike } = req.body; // Whether it's a like or dislike

  try {
    const userId = req.user.id; // Extract userId from the JWT token

    const like = await likeComment(userId, commentId, isLike);
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
