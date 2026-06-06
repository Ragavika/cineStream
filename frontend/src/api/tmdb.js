import axios from "axios";

// Now calling our local Express backend (routed via the Vite proxy)
const BASE_URL = "/api/movies";

// Fetch popular movies
export async function fetchPopularMovies(page = 1) {
  try {
    const res = await axios.get(`${BASE_URL}/popular`, {
      params: { page }
    });
    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// Search movies by query
export async function searchMovies(query, page = 1) {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: { query, page }
    });
    return res.data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}
