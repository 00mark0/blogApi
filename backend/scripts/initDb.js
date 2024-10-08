import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Drop existing tables if they exist
    await client.query(`
      DROP TABLE IF EXISTS likes;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS user_profiles;
      DROP TABLE IF EXISTS users;
    `);

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        failed_attempts INTEGER DEFAULT 0,
        is_locked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Articles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        like_count INTEGER DEFAULT 0,
        dislike_count INTEGER DEFAULT 0
      );
    `);

    // Comments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id),
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        like_count INTEGER DEFAULT 0,
        dislike_count INTEGER DEFAULT 0
      );
    `);

    // Likes Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        article_id INTEGER REFERENCES articles(id),
        comment_id INTEGER REFERENCES comments(id),
        is_like BOOLEAN NOT NULL,
        UNIQUE (user_id, article_id),
        UNIQUE (user_id, comment_id)
      );
    `);

    // UserProfiles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        bio TEXT,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
};

createTables().catch((err) =>
  console.error("Error initializing database:", err)
);
