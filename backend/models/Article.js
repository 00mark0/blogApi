import pool from "../config/db.js";

export const createArticle = async (userId, title, content) => {
  const result = await pool.query(
    "INSERT INTO articles (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
    [userId, title, content]
  );
  return result.rows[0];
};

export const getArticles = async () => {
  const result = await pool.query(
    "SELECT * FROM articles ORDER BY created_at DESC"
  );
  return result.rows;
};

export const getArticleById = async (id) => {
  const result = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateArticle = async (id, title, content) => {
  const result = await pool.query(
    "UPDATE articles SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    [title, content, id]
  );
  return result.rows[0];
};

export const deleteArticle = async (id) => {
  await pool.query("DELETE FROM articles WHERE id = $1", [id]);
};
