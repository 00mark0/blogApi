// backend/config/db.js
import pkg from "pg"; // Import the pg package for PostgreSQL
import dotenv from "dotenv"; // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg; // Destructure the Pool class from the pg package

// Create a new pool instance with the database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from environment variables
  ssl: {
    rejectUnauthorized: false, // This is necessary for self-signed certificates
  },
});

export default pool; // Export the pool instance to be used in other parts of the application
