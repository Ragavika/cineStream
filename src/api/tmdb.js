import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch popular movies
export async function fetchPopularMovies(page = 1) {
  const res = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY, page }
  });
  return res.data.results;
}

// Search movies by query
export async function searchMovies(query, page = 1) {
  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query, page }
  });
  return res.data.results;
}
