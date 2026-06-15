import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dns from "node:dns";

// Force public DNS resolution for Atlas SRV records in restricted networks.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend and project root
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../frontend/.env") });
dotenv.config({ path: path.resolve(__dirname, "../frontend/.env.txt") });

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5001;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI?.trim();

const connectMongo = async () => {
  if (!mongoUri) {
    console.warn("⚠️ MONGO_URI is not set. MongoDB-backed routes are disabled.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.warn("⚠️ MongoDB is unavailable right now; continuing without database routes.", err.message);
  }
};

await connectMongo();

// ✅ Define Post schema & model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model("Post", postSchema);

// TMDB API setup
const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

app.use((req, res, next) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB API key is not configured on the server." });
  }
  next();
});

// TMDB routes
app.get("/api/movies/popular", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, page },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to fetch popular movies." });
  }
});

app.get("/api/movies/search", async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required." });
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query, page },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error searching movies:", error.message);
    res.status(error.response?.status || 500).json({ error: "Failed to search movies." });
  }
});

// ✅ Replace placeholder post routes with MongoDB CRUD
const ensureMongoReady = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    error: "MongoDB is not available right now. Check your MONGO_URI and network access.",
  });
};

app.get("/posts", ensureMongoReady, async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.get("/posts/:id", ensureMongoReady, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

app.post("/posts", ensureMongoReady, async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
});

app.put("/posts/:id", ensureMongoReady, async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

app.delete("/posts/:id", ensureMongoReady, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json({ message: "Post deleted successfully" });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start server with automatic fallback if the default port is busy
const startServer = (port = DEFAULT_PORT) => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy. Trying ${port + 1} instead...`);
      server.close(() => startServer(port + 1));
      return;
    }

    console.error("Server startup error:", err);
    process.exit(1);
  });
};

startServer();

app.get("/ping", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return res.status(503).json({ error: "MongoDB is not connected right now." });
    }

    await mongoose.connection.db.admin().ping();
    res.json({ message: "✅ Server and MongoDB Atlas are alive!" });
  } catch (error) {
    console.error("Ping failed:", error);
    res.status(503).json({ error: "MongoDB ping failed. Check your Atlas URI and network access." });
  }
});
