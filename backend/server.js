import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Import path module
import userRoutes from "./routes/userRoutes.js";
import passwordResetRoutes from "./routes/passwordResetRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/users", limiter);
app.use("/api/users", userRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

app.use(errorHandler);

// Serve static files from the React app
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
