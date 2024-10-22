import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createUser = async (
  username,
  password,
  email,
  isAdmin = false
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (username, password, email, is_admin) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, hashedPassword, email, isAdmin]
  );
  return result.rows[0];
};

export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const updateUserFailedAttempts = async (username, failedAttempts) => {
  await pool.query(
    "UPDATE users SET failed_attempts = $1 WHERE username = $2",
    [failedAttempts, username]
  );
};

export const lockUserAccount = async (username) => {
  await pool.query("UPDATE users SET is_locked = true WHERE username = $1", [
    username,
  ]);
};

export const resetFailedAttempts = async (username) => {
  await pool.query("UPDATE users SET failed_attempts = 0 WHERE username = $1", [
    username,
  ]);
};

export const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT * FROM users WHERE is_locked = false"
  );
  return result.rows;
};

export const deleteUserAdmin = async (id) => {
  await pool.query("UPDATE users SET is_locked = true WHERE id = $1", [id]);
};

export const deleteOwnAccount = async (id) => {
  // Decrement like and dislike counts on articles and comments
  await pool.query(
    `UPDATE articles SET like_count = like_count - 1 WHERE id IN (SELECT article_id FROM likes WHERE user_id = $1 AND is_like = true)`,
    [id]
  );
  await pool.query(
    `UPDATE articles SET dislike_count = dislike_count - 1 WHERE id IN (SELECT article_id FROM likes WHERE user_id = $1 AND is_like = false)`,
    [id]
  );
  await pool.query(
    `UPDATE comments SET like_count = like_count - 1 WHERE id IN (SELECT comment_id FROM likes WHERE user_id = $1 AND is_like = true)`,
    [id]
  );
  await pool.query(
    `UPDATE comments SET dislike_count = dislike_count - 1 WHERE id IN (SELECT comment_id FROM likes WHERE user_id = $1 AND is_like = false)`,
    [id]
  );

  // Delete likes associated with the user's comments
  await pool.query(
    `DELETE FROM likes WHERE comment_id IN (SELECT id FROM comments WHERE user_id = $1)`,
    [id]
  );

  // Delete likes and comments
  await pool.query("DELETE FROM likes WHERE user_id = $1", [id]);
  await pool.query("DELETE FROM comments WHERE user_id = $1", [id]);

  // Delete user
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const updateUserDetails = async (id, newUsername, newEmail) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *",
    [newUsername, newEmail, id]
  );
  return result.rows[0];
};

// Get user by ID
export const getUser = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};
