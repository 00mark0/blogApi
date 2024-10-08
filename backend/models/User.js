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
