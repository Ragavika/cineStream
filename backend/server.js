import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in the project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Middleware to check if API key exists
app.use((req, res, next) => {
  if (!TMDB_API_KEY) {
    return res
      .status(500)
      .json({ error: "TMDB API key is not configured on the server." });
  }
  next();
});

// --- API Endpoints ---
app.get("/movies/popular", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, page },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching popular movies:", error.message);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.status_message ||
      "Failed to fetch popular movies from TMDB.";
    res.status(status).json({ error: message });
  }
});

app.get("/movies/search", async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query, page },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error searching movies:", error.message);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.status_message ||
      "Failed to search movies from TMDB.";
    res.status(status).json({ error: message });
  }
});

// Example posts endpoints
app.get("/posts", (req, res) => res.json({ message: "GET /posts route active" }));
app.get("/posts/:id", (req, res) =>
  res.json({ message: `GET /posts/${req.params.id} route active` })
);
app.post("/posts", (req, res) =>
  res.json({ message: "POST /posts route active" })
);
app.put("/posts/:id", (req, res) =>
  res.json({ message: `PUT /posts/${req.params.id} route active` })
);
app.delete("/posts/:id", (req, res) =>
  res.json({ message: `DELETE /posts/${req.params.id} route active` })
);

// --- Serve React frontend build ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// --- Start server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
