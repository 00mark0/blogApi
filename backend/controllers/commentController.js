import {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
  getCommentById,
} from "../models/Comment.js";

// Create new comment (articleId from path, userId from JWT)
export const createNewComment = async (req, res) => {
  const { articleId } = req.params; // Get articleId from the path
  const { content } = req.body;

  try {
    const userId = req.user.id; // Get userId from JWT

    const comment = await createComment(articleId, userId, content);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comments by articleId
export const getComments = async (req, res) => {
  const { articleId } = req.params;

  try {
    const comments = await getCommentsByArticleId(articleId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update existing comment
export const updateExistingComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id; // Extract userId from the JWT token

  try {
    const comment = await getCommentById(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the owner of the comment
    if (comment.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
    }

    const updatedComment = await updateComment(id, content);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete comment
export const deleteExistingCommentAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteComment(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExistingComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Extract userId from the JWT token

  try {
    const comment = await getCommentById(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the owner of the comment
    if (comment.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    await deleteComment(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
