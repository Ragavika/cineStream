import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../api/tmdb";
import MovieGrid from "../components/MovieGrid";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchPopularMovies().then(setMovies);
  }, []);

  return (
    <div>
      <h2>Popular Movies</h2>
      <MovieGrid movies={movies} />
    </div>
  );
}
