import pool from "../config/db.js";

export const createComment = async (articleId, userId, content) => {
  const result = await pool.query(
    "INSERT INTO comments (article_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [articleId, userId, content]
  );
  return result.rows[0];
};

export const getCommentsByArticleId = async (articleId) => {
  const result = await pool.query(
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
    [articleId]
  );
  return result.rows;
};

export const updateComment = async (id, content) => {
  const result = await pool.query(
    "UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [content, id]
  );
  return result.rows[0];
};

export const deleteComment = async (id) => {
  await pool.query("DELETE FROM comments WHERE id = $1", [id]);
};

export const getCommentById = async (id) => {
  const result = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
  return result.rows[0];
};

export const getCommentsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT comments.*, articles.title as article_title FROM comments JOIN articles ON comments.article_id = articles.id WHERE comments.user_id = $1",
    [userId]
  );
  return result.rows;
};

export const deleteCommentsByArticleId = async (articleId) => {
  await pool.query("DELETE FROM comments WHERE article_id = $1", [articleId]);
};

export const deleteLikesByArticleId = async (articleId) => {
  await pool.query("DELETE FROM likes WHERE article_id = $1", [articleId]);
};

export const deleteLikesByCommentId = async (articleId) => {
  await pool.query(
    "DELETE FROM likes WHERE comment_id IN (SELECT id FROM comments WHERE article_id = $1)",
    [articleId]
  );
};
