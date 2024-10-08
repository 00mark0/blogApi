import pool from "../config/db.js";

export const likeArticle = async (userId, articleId, isLike) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert or update the like
    const result = await client.query(
      `INSERT INTO likes (user_id, article_id, is_like)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, article_id)
       DO UPDATE SET is_like = EXCLUDED.is_like
       RETURNING *`,
      [userId, articleId, isLike]
    );

    // Update the like and dislike counts in the articles table
    await client.query(
      `UPDATE articles
       SET like_count = (SELECT COUNT(*) FROM likes WHERE article_id = $1 AND is_like = true),
           dislike_count = (SELECT COUNT(*) FROM likes WHERE article_id = $1 AND is_like = false)
       WHERE id = $1`,
      [articleId]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const likeComment = async (userId, commentId, isLike) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert or update the like
    const result = await client.query(
      `INSERT INTO likes (user_id, comment_id, is_like)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, comment_id)
       DO UPDATE SET is_like = EXCLUDED.is_like
       RETURNING *`,
      [userId, commentId, isLike]
    );

    // Update the like and dislike counts in the comments table
    await client.query(
      `UPDATE comments
       SET like_count = (SELECT COUNT(*) FROM likes WHERE comment_id = $1 AND is_like = true),
           dislike_count = (SELECT COUNT(*) FROM likes WHERE comment_id = $1 AND is_like = false)
       WHERE id = $1`,
      [commentId]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
